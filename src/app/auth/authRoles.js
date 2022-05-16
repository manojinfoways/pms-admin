/**
 * Authorization Roles
 */
const authRoles = {
  admin: ["admin"],
  service_provider: ["service_provider"],
  researcher: ["researcher"],
  poster: ["poster"],
  all: ["admin", "service_provider"],
  staff: ["admin", "staff"],
  user: ["admin", "developer", "user"],
  onlyGuest: [],
};

export default authRoles;
