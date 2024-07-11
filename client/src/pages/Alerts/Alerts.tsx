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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
      <h2>Current Emergencies</h2>
      <h2>You have {emergencies.length} total emergencies</h2>
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
        <p className={`emergency-status status-${emergency.status.toLowerCase()}`}>Status: {emergency.status}</p>
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
              <p>
                <span onClick={handleUserClick} style={{ fontWeight: "bolder", cursor: "pointer", color: "" }}>User ID</span>:{" "}
                {emergency.user}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Status</span>:{" "}
                {emergency.status}
              </p>
              <h2>
                <span style={{ fontWeight: "bolder", fontSize: "2rem" }}>
                  {emergency.title}
                </span>
              </h2>
              <p>
                <span style={{ fontWeight: "bolder" }}>Location:</span>{" "}
                {emergency.place}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Condition:</span>{" "}
                {emergency.condition}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Description:</span>{" "}
                {emergency.description}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Responder:</span>{" "}
                {emergency.responder}
              </p>
              {emergency.createdAt && (
                <p>
                  <span style={{ fontWeight: "bolder" }}>Time requested:</span>{" "}
                  {new Date(emergency.createdAt).toLocaleString()}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              {(emergency.status === "Delivered" || emergency.status === "Pending") &&
                (user?.roles.includes("Admin") || user?.roles.includes("Employee")) && (
                  <Button
                    variant="ghost"
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
