import React, { useEffect, useState } from "react";
import "./Records.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { fetchAllEmergencies } from "../../redux/slices/EmergencySlice";
import { Emergency } from "../../models/Emergency";
import TopBar from "../../components/topbar/TopBar";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import Footer from "../../components/footer/Footer";

const Records: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchEmergencies = async () => {
      const emergenciesAction = await dispatch(fetchAllEmergencies());
      const fetchedEmergencies: Emergency[] = emergenciesAction.payload;

      let filteredEmergencies: Emergency[] = [];

      if (user?.roles.includes("Admin") || user?.roles.includes("Employee")) {
        filteredEmergencies = fetchedEmergencies.filter(
          (emergency) => emergency.status === "Done"
        );
      } else {
        filteredEmergencies = fetchedEmergencies.filter(
          (emergency) => emergency.user === user?._id && emergency.status === "Done"
        );
      }

      setEmergencies(filteredEmergencies);
    };

    fetchEmergencies();
  }, [dispatch, user]);

  return (
    <div>
      <TopBar />
      <Heading as="h2" mt={4} textAlign="center">Records</Heading>
      <ul className="all-cards-container">
        {emergencies.map((emergency) => (
          <RecordItemComponent key={emergency._id} emergency={emergency} />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

interface RecordItemProps {
  emergency: Emergency;
}

const RecordItemComponent: React.FC<RecordItemProps> = ({ emergency }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <li key={emergency._id} className="emergency-container card">
      <Box tabIndex={-1} aria-label="Focus moved to this box" className="card-content">
        <h3 className="record-title">{emergency.title}</h3>
        <p className={`emergency-status status-${emergency.status.toLowerCase()}`}>Status: {emergency.status}</p>
        {emergency.updatedAt && (
          <p className="emergency-time">
            <span style={{ fontWeight: "bolder" }}>Time requested:</span>{" "}
            {new Date(emergency.updatedAt).toLocaleString()}
          </p>
        )}
        <Button className="modal-button" mt={4} onClick={onOpen}>
          <i className="fa-solid fa-maximize"></i>
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Emergency Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>
                <span style={{ fontWeight: "bolder" }}>User ID</span>: {emergency.user}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Status</span>: {emergency.status}
              </p>
              <h2>
                <span style={{ fontWeight: "bolder", fontSize: "2rem" }}>
                  {emergency.title}
                </span>
              </h2>
              <p>
                <span style={{ fontWeight: "bolder" }}>Location:</span> {emergency.place}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Condition:</span> {emergency.condition}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Description:</span> {emergency.description}
              </p>
              <p>
                <span style={{ fontWeight: "bolder" }}>Responder:</span> {emergency.responder}
              </p>
              {emergency.createdAt && (
                <p>
                  <span style={{ fontWeight: "bolder" }}>Time requested:</span> {new Date(emergency.createdAt).toLocaleString()}
                </p>
              )}
              {emergency.updatedAt && (
                  <p>
                    <span style={{ fontWeight: "bolder" }}>Time resolved:</span> {new Date(emergency.updatedAt).toLocaleString()}
                  </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </li>
  );
};

export default Records;
