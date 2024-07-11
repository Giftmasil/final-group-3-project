import "./Settings.css";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { updateUser } from "../../redux/slices/UserSlice";
import { User } from "../../models/User";
import TopBar from "../../components/topbar/TopBar";

const Settings: React.FC = () => {
  const { user, loading, success, error } = useSelector((state: RootState) => state.user);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const dispatch: AppDispatch = useDispatch();

  // Initialize updatedUser with the current user data
  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updatedUser) {
      dispatch(updateUser(updatedUser));
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log(user);
  

  return (
    <div>
      <TopBar />
      <h2>Edit Profile</h2>
      <img src={user.profileUrl} alt="Profile" title="profile" width={100} height={100} />
      <form onSubmit={handleSubmit}>
        <label>
          ProfileUrl:
          <input
            type="text"
            name="profileUrl"
            defaultValue={user.profileUrl}
            placeholder="enter image usrl here"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            placeholder="John Doe"
            defaultValue={user.username}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            placeholder="example@gmail.com"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            placeholder="555-555-5555"
            defaultValue={user.phoneNumber.toString()}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            placeholder="20"
            defaultValue={user.age?.toString()}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            placeholder="5120-02000"
            defaultValue={user.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Medical History:
          <textarea
            name="medicalHistory"
            defaultValue={user.medicalHistory}
            placeholder="hypertention, asthma"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Current Medication:
          <input
            type="text"
            name="currentMedication"
            placeholder="morphine"
            defaultValue={user.currentMedication}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Vaccination:
          <input
            type="text"
            name="vaccination"
            defaultValue={user.vaccination}
            placeholder="BCG"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Emergency Contact Name:
          <input
            type="text"
            name="emergencyContactName"
            defaultValue={user.emergencyContactName}
            placeholder="John Doe"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Relationship:
          <input
            type="text"
            name="relationship"
            defaultValue={user.relationship}
            placeholder="brother"
            onChange={handleInputChange}
          />
        </label>
        <label>
          Emergency Contact Number:
          <input
            type="text"
            name="emergencyContactNumber"
            defaultValue={user.emergencyContactNumber?.toString()}
            placeholder="555-555-5555"
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
      {loading && <p>Updating profile...</p>}
      {error && <p>There was an error. Please try again.</p>}
      {success && <p>Profile updated successfully!</p>}
    </div>
  );
};

export default Settings;
