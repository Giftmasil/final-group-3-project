import React, { useEffect, useState } from "react";
import "./Alerts.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { fetchAllEmergencies, updateEmergencyStatus } from "../../redux/slices/EmergencySlice";
import { Emergency } from "../../models/Emergency";
import TopBar from "../../components/topbar/TopBar";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Button,
  Heading,
  Stack,
  Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const Alerts: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchEmergencies = async () => {
      const emergenciesAction = await dispatch(fetchAllEmergencies());
      let fetchedEmergencies: Emergency[] = emergenciesAction.payload;
      fetchedEmergencies = fetchedEmergencies.filter(
        (emergency: Emergency) =>
          emergency.status === "Delivered" || emergency.status === "Pending"
      );

      if (user?.roles.includes("Admin") || user?.roles.includes("Employee")) {
        setEmergencies(fetchedEmergencies);
      } else {
        const myEmergencies = fetchedEmergencies.filter(
          (emergency: Emergency) => emergency.user === user?._id
        );
        setEmergencies(myEmergencies);
      }
    };

    fetchEmergencies();
  }, [dispatch, user, refresh]);

  return (
    <div>
      <TopBar />
      <Heading as="h2" mt={4} textAlign="center">Current Emergencies: <span style={{ color: "red" }}>{emergencies.length}</span></Heading>
      {emergencies.length === 0 ? (
        <h1>No emergencies yet</h1>
      ) : (
        <ul className="all-cards-container">
        {emergencies.map((emergency) => (
          <EmergencyItemComponent
            key={emergency._id}
            emergency={emergency}
            setRefresh={setRefresh}
          />
        ))}
      </ul>
      )}
      <Footer />
    </div>
  );
};

interface EmergencyItemProps {
  emergency: Emergency;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmergencyItemComponent: React.FC<EmergencyItemProps> = ({ emergency, setRefresh }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleAccept = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const updatedEmergency: Emergency = {
            ...emergency,
            status: "Pending",
            responder: user?._id,
            responderLatitude: lat.toString(),
            responderLongitude: lon.toString(),
          };

          await dispatch(
            updateEmergencyStatus({ id: updatedEmergency._id!, newEmergency: updatedEmergency })
          )
            .then(() => setRefresh((prev) => !prev))
            .catch((error) =>
              console.error("Error updating emergency status:", error)
            );
        },
        showError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    function showError(error: GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        default:
          alert("An unknown error occurred.");
          break;
      }
    }
  };

  const handleDone = async () => {
    const updatedEmergency: Emergency = { ...emergency, status: "Done" };
    await dispatch(updateEmergencyStatus({ id: updatedEmergency._id!, newEmergency: updatedEmergency }))
      .then(() => setRefresh((prev) => !prev))
      .catch((error) => console.error("Error updating emergency status:", error));
  };

  const handleModalHeaderClick = (emergencyId: string) => {
    if (user?.roles.includes("User")) {
      navigate(`/alerts`);
      onClose()
      return
    }
    navigate(`/emergency/${emergencyId}`);
    onClose();
  };

  const handleUserClick = () => {
    navigate(`/search?query=${emergency.user}`);
  };

  return (
    <li key={emergency._id} className="emergency-container card">
      <Box className="card-content">
        <h3 className="emergency-title">{emergency.title}</h3>
        <p className={`emergency-status status-${emergency.status.toLowerCase()}`}><span style={{color:"#333333"}}>Status:</span> {emergency.status}</p>
        {emergency.createdAt && (
          <p className="emergency-time">
            <span style={{ fontWeight: "bolder" }}>Time requested:</span>{" "}
            {new Date(emergency.createdAt).toLocaleString()}
          </p>
        )}
        <Button className="modal-button" mt={4} onClick={onOpen}>
          <i className="fa-solid fa-maximize"></i>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className="modal-header" onClick={() => handleModalHeaderClick(emergency._id!)}>
              Emergency Details
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <Text>
                  <span onClick={handleUserClick} className="userId">User ID:</span> {emergency.user}
                </Text>
                <Text>
                  <span style={{ fontWeight: "bolder" }}>Status:</span> {emergency.status}
                </Text>
                <Text fontWeight="bolder" fontSize="2xl">
                  {emergency.title}
                </Text>
                <Text>
                  <span style={{ fontWeight: "bolder" }}>Location:</span> {emergency.place}
                </Text>
                <Text>
                  <span style={{ fontWeight: "bolder" }}>Condition:</span> {emergency.condition}
                </Text>
                <Text>
                  <span style={{ fontWeight: "bolder" }}>Description:</span> {emergency.description}
                </Text>
                <Text>
                  <span style={{ fontWeight: "bolder" }}>Responder:</span> {emergency.responder}
                </Text>
                {emergency.createdAt && (
                  <Text>
                    <span style={{ fontWeight: "bolder" }}>Time requested:</span> {new Date(emergency.createdAt).toLocaleString()}
                  </Text>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
            <Button variant="outline" _hover={{ bg: '#9747FF' , textDecoration: 'underline', color:'white'}} mr={3} onClick={onClose}>
                Close
              </Button>
              {(emergency.status === "Delivered" || emergency.status === "Pending") &&
                (user?.roles.includes("Admin") || user?.roles.includes("Employee")) && (
                  <Button
                    variant="outline"
                    bg="#9747FF"
                    color="white"
                    _hover={{ bg: 'white' , textDecoration: 'underline', color:'black'}}
                  

                    onClick={emergency.status === "Delivered" ? handleAccept : handleDone}
                  >
                    {emergency.status === "Delivered" ? "Accept" : "Done"}
                  </Button>
                )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </li>
  );
};

export default Alerts;
