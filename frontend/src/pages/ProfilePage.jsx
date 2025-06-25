import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";



const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore(); 
  const [selectedImg, setSelectedImg] = useState(null);

  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
  const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (!confirmed) return;

  try {
    await axiosInstance.delete(`/delete/${authUser._id}`, {
      withCredentials: true,
    });

    // Optional: call logout endpoint to clear cookies/session on server
    await axiosInstance.post("/auth/logout", {}, {
      withCredentials: true,
    });

    // Clear local auth state (if using Zustand or other store)
    useAuthStore.getState().logoutUser?.(); // <-- only if you have a logoutUser() action

    // Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Failed to delete account:", error.response?.data || error.message);
    alert("Failed to delete account. Try again.");
  }



  try {
await axiosInstance.delete(`/delete/${authUser._id}`, {
  withCredentials: true,
});
    localStorage.clear(); // clear any tokens or auth data
    navigate("/login"); // redirect after deletion
  } 
catch (error) {
  console.error("Failed to delete account:", error.response?.data || error.message);
  alert("Account deletion successful");
}

};


  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; //takes the latest file that user selected
    if (!file) return;

    const reader = new FileReader(); //to read the file

    reader.readAsDataURL(file); //render the file on the ui

    reader.onload = async () => {
      const base64Image = reader.result; //convert the image to base 64 image
      setSelectedImg(base64Image); 
      await updateProfile({ profilePic: base64Image }); //invokes the function in useauth stoere
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"} /* Show the selected image, if thats not available, then show the current profile pic, or if nothing, then show avatar png */
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>

              </div>
                           <div className="flex justify-end mt-4">
  <button
    onClick={handleDeleteAccount}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  >
    Delete Account
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;