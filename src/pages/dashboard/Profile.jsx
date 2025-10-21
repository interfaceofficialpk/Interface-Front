import { GlobalConfig } from "../../GlobalConfig";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { appName } = GlobalConfig;
  const { getEmail } = useAuth();
  const title = `${appName} - Profile`;

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: getEmail() || "",
    phone: "",
    address: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Updating personal info:", personalInfo);
    } catch (error) {
      console.error("Error updating personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      console.log("Changing password");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <title>{title}</title>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="profile_tabs"
          className="tab"
          aria-label="Personal Information"
          defaultChecked
        />
        <div className="tab-content p-4">
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                  placeholder="Email"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                  placeholder="Phone"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-outline"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <input
          type="radio"
          name="profile_tabs"
          className="tab"
          aria-label="Security"
        />
        <div className="tab-content p-4">
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={security.currentPassword}
                onChange={(e) =>
                  setSecurity((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Current Password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={security.newPassword}
                onChange={(e) =>
                  setSecurity((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="New Password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={security.confirmPassword}
                onChange={(e) =>
                  setSecurity((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-outline"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
