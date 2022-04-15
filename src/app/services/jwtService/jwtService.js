import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { authRoles } from "app/auth";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 4001 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const token = this.getAccessToken();

    if (!token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(token)) {
      this.setSession(token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/users/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data) {
            const nArray = {};
            const resData = response.data;

            let role = "admin";
            // if (resData.roles.includes("ROLE_ADMIN")) {
            //   role = "admin";
            // } else {
            //   reject({ status: false, message: "You are not admin" });
            //   return false;
            // }
            console.log("Login==", resData);

            nArray.token = resData.token;

            nArray.user = {};
            nArray.user.role = role;
            nArray.user.data = {};
            nArray.user.data.displayName = resData.data.firstname;
            nArray.user.data.otherInfo = resData;

            nArray.user.data.photoURL = resData.data.profileImage
              ? resData.data.profileImage
              : `${process.env.REACT_APP_PUBLIC}/assets/images/avatars/profile.jpg`;
            nArray.user.data.email = resData.data.email;
            nArray.user.data.settings = {};
            nArray.user.data.shortcuts = [];
            this.setSession(resData.token);
            resolve(nArray.user);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          console.log("EERR", error.message);
          let errormsg =
            error.response && error.response.data.message
              ? error.response.data.message
              : "Somthing went wrong! Please try later";
          reject(
            error.data
              ? error.response.data
              : { status: false, message: errormsg }
          );
        });
    });
  };
  signInWithEmailAndPasswordPTR = (email, password) => {
    // return new Promise((resolve, reject) => {
    //   axios
    //     .get('/api/auth', {
    //       data: {
    //         email,
    //         password,
    //       },
    //     })
    //     .then((response) => {
    //       if (response.data.user) {
    //         this.setSession(response.data.token);
    //         resolve(response.data.user);
    //       } else {
    //         reject(response.data.error);
    //       }
    //     });
    // });
    return new Promise((resolve, reject) => {
      this.setSession("jhgkjfhgkdhfkghdkfhgkdfhgkdhkgdfhkd");
      let role;
      let redirectUrl;

      if (email === "admin@ptr.com") {
        role = authRoles.admin;
        redirectUrl = "ptr/admin/dashboard";
      } else if (email === "staff@ptr.com") {
        role = authRoles.staff;
        redirectUrl = "dlm/dashboard";
      } else if (email === "user@ptr.com") {
        role = authRoles.user;
        redirectUrl = "ptr/dashboard";
      } else {
        reject({
          message: "Invalid Credentials",
        });
      }
      const user = {
        redirectUrl: redirectUrl,
        role,
        data: {
          displayName: "John Doe",
          photoURL: "",
          email,
        },
        shortcuts: [],
      };

      resolve(user);
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/auth/verify", {
          token: this.getAccessToken(),
        })
        .then((response) => {
          if (response.data) {
            if (response.data) {
              const nArray = {};
              const resData = response.data.data;
              // console.log("PLZ", resData);
              let role = "admin";
              // if (resData.roles.includes("ROLE_ADMIN")) {
              //   role = "admin";
              // } else {
              //   reject({ status: false, message: "You are not admin" });
              //   return false;
              // }
              console.log("Verify==", resData);

              nArray.access_token = response.data.token;
              nArray.user = {};
              nArray.user.role = role;
              nArray.user.data = {};
              nArray.user.data.displayName = resData.firstname;
              nArray.user.data.otherInfo = response.data;

              nArray.user.data.photoURL = resData.profileImage
                ? resData.profileImage
                : `${process.env.REACT_APP_PUBLIC}/assets/images/avatars/profile.jpg`;
              nArray.user.data.email = resData.email;
              nArray.user.data.settings = {};
              nArray.user.data.shortcuts = [];
              this.setSession(response.data.token);
              console.log("TOKEN==", response.data.token);

              resolve(nArray.user);
            } else {
              reject(response.data.error);
            }
            // this.setSession(response.data.access_token);
            //  resolve(response.data);
          } else {
            this.logout();
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post("/api/auth/user/update", {
      user,
    });
  };

  setSession = (token) => {
    if (token) {
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common.Authorization = ` ${token}`;
    } else {
      localStorage.removeItem("jwt_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };
  // setSession = (refresh_token) => {
  //   if (refresh_token) {
  //     localStorage.setItem("jwt_refresh_token", refresh_token);
  //     axios.defaults.headers.common.Authorization = `Bearer ${refresh_token}`;
  //   } else {
  //     // localStorage.removeItem('jwt_refresh_token');
  //     delete axios.defaults.headers.common.Authorization;
  //   }
  // };

  logout = () => {
    this.setSession(null);
  };

  isAuthTokenValid = (token) => {
    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_token");
  };
}

const instance = new JwtService();

export default instance;
