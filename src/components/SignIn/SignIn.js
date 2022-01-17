import React, { useCallback, useEffect, useState } from "react";
import "./SignIn.css";
import Input from "../../helpers/Input";
import ActionButton from "../../helpers/ActionButton";
import { Link, Redirect, useHistory } from "react-router-dom";
import axios from "axios";



const SignIn = () => {
  var redirect = useHistory()
  function LogIn() {
    window.location = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20profile%20email&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http%3A//localhost:3000&client_id=708926803452-36furosao0v091r4aqjfuj59ff35sc0u.apps.googleusercontent.com`
    
  }

  var query = window.location.href;
  //console.log(query)

  var vars = query.split("&");
  //console.log(vars)
  var realtoken = ""

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    //console.log(pair)
    if (pair[0] == 'access_token') {
      //console.log('FOUND IT:' + pair[1]);
      realtoken = pair[1];
      break;
    }
  }

  document.cookie = `authtoken=${realtoken};max-age=604800;domain=localhost`
  // const cookieValue = document.cookie.split('; ').find(row => row.startsWith('authtoken')).split('=')[1];
  // console.log(cookieValue)

  // const [request, setRequest] = useState()
  try {
    console.log("sALUTTDSbsdbsdsd");
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
      headers: {
        Authorization: 'Bearer ' + realtoken
      }
    }).then(
      (response) => {
        console.log("GOOGLE ", response);
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify(response));
        let request = {
          username: response.data.name,
          email: response.data.email,
          password: "",
          photo: response.data.picture,
          is_admin: false,
          notes: "",
          token: realtoken
        };
        axios.post(`/users`, request).then(
          (response) => {
            console.log("SQL", response);
            redirect.push('/dash');
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );

  } catch (e) {
    console.log(e)
  }

  return (
    <div>
      <div className="signContainer" id="intro">
        <div className="signGroup" id="introGroup">
          <div className="messageSpan">
            Notes22™
          </div>
        </div>
      </div>
      <div className="signContainer">
        <div className="signGroup">
          <div className="logoContainer">
          </div>
          <div className="messageSpan">LOG IN</div>
          <div className="inputFields">
            <div className="inputField">
              <Input
                type="text"
                defaultValue="username"
              />
            </div>
            <div className="inputField" id="second">
              <Input type="password" defaultValue="password" />
            </div>

            <div className="buttonContainer" onClick={() => {LogIn()} }>
              <ActionButton text="CONTINUĂ" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;