import './App.css';
import React, { useEffect, useState } from "react";
const S3 = require('aws-sdk/clients/s3')

const uuid = require('uuid');

function App() {

  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenication.')
  const [visitorName, setVisitorName] = useState("https://zach-sherin-engagment-photos.s3.us-east-2.amazonaws.com/hello_SD.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQDYQo1ZNPWu6bN4i1oZym75ZyZPU6wVrGoeZh%2B2l0KUMAIhAL1Yt0iX5sBo6QuRjLgMMKFI8AfJboec3TsFlSoZ5ukpKu0CCLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMTc2MzA0MzY0MTMwIgwyQWwjLj6SRxVZf%2BkqwQKEh9x8zG1Ba2isbY56PmUvkAg6y4%2Ft5Kqr%2BYqogkhWe%2BifybgwNxesthagGMiCytcf2WJ%2BRmGKD%2Frw9ouHvYRaJgu6LzCsfZGNRNCFuCCp1s%2Fg%2FJfgQuWeSSol8Ak%2F%2FXX2X3A%2BpZ%2BL06xe1TsPLEpcCxndtDSwNVd2uG9rVnUQPlPp7u9shHjZPW46XN1CCu3RjCxvA0UXm4pLcUy91L%2BWhFfX4ccxTZBY6phs%2BjDR%2B2IgtPSkhi89uT0cMHdK7N0Zx%2BRLuS7oZU1MbuKasDlVedMi8htBgAe53j5Mx%2BSuAmpcYNwXbSb9BUnRaHY8qgHfHgWkx8v6mF2bgsA5zzldUgd4%2FTiyqVMAAnC3dNQxvEHAFdKQUcexTUpyb1fGvGL61cCXa7LSkV83meY41qvoWctGT26EG9oE8Ah2a0E317Uw5%2FqjqAY6sgIo3rzmxphpfpTpFaRzHQ38T2fY%2BjgRlNc5fVXPzpUl171oWoHOoVXU9%2BgD7e%2Br974AXaQUl%2B4pUcN4c%2BHkqwyhgqK6MuNK4ZX0qVcp6JCqDW%2F6b32z%2BFbET%2B5zgQ0Xsj8UAB1wQR6jhVRW8E07ObwFM70qnTRIAD5LtjwpUDyMQ1PfMBP%2FMiLHUasrVgkTZLEC%2BYo4Mk5eIp4ZCOD3EnWKOG5WooBa5YzzYgmilck5slJOct3GXdvGrvUdbqRcCCPous0LtJTWXdtd1ao4D9mWZIyCAXdR%2F4N%2Br1QNDtTCaogkTn3l44KIzHiSMrNR80IkGlnMU%2FjSZuUZruXpEqEfo1uMWOHyyMmwZMBjq84h7y3%2BP9LtgwcHqfIbvAI2ez8jpcnZ6m9tA5cGJLc0UfAL2GA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230919T023517Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIASSDEPDJRFULW4OKH%2F20230919%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=5984945fd23c570fd2611f01ca2b6241b4a11791bf20b1a67cc2cb64b9bb2c0e");
  const [isAuth, setAuth] = useState(false);
  const [data, setData] = useState({Metadata:{[name]: value}});
  
  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    setUploadResultMessage(`Working ${image.name}`)

    const visitorImageName = uuid.v4();
    fetch(`https://42bt4wcvl8.execute-api.us-east-2.amazonaws.com/dev/analyze-people-data/${visitorImageName}.jpg`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpg',
    },
    body: image}).then( async () => {
      setUploadResultMessage(`Done uploading ${image.name}`)
      const reponse = await authenticate(visitorImageName)
    setUploadResultMessage(`done authenicating ${image.name}`)
    console.debug(reponse)
    if (reponse.Message === 'Success'){
      setAuth(true)
      setUploadResultMessage(`File Keys ${reponse['key']}`)
      }else {
        setUploadResultMessage(reponse.Message)
        setUploadResultMessage("FAIL!")
        setAuth(false)
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication proces.')
      console.error(error);
    })
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://42bt4wcvl8.execute-api.us-east-2.amazonaws.com/dev/peoplelol?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpg`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((data) => {
      return data.json();

    }).catch(error => console.error(error));
  }

  async function tester(){
    const response = await getPicture();
    if (response.Message == "Success"){
      console.debug(response)
      setVisitorName( response.url)
      setData(response.urlList)
      response.urlList.map( x => {
        console.debug(x.object_url);
      })

    }
  }

  async function getPicture(){
      const requestUrl = 'https://42bt4wcvl8.execute-api.us-east-2.amazonaws.com/dev/photo_repo/get-presigned-urls'
      return await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((data) => {
        return data.json();
  
      }).catch(error => {setData("Failed");console.error(error)});
  }


  return ( 
    <div className="App">
      <h2>Facial Recognition systm</h2>
      <form onSubmit={sendImage}>
      <input type='file' name='image' onChange={e => setImage(e.target.files[0])} />
        <button type='submit'>Authenticate</button>
      </form>
      <div >{uploadResultMessage}</div>
      <img src={ visitorName} alt="Visitor" height={250} width={250} />
      
      {
        
       <img src={ visitorName} alt="Visitor" height={250} width={250} />

      }

    <button onClick={tester}>BUTTON</button>
    <label>"::{data}::</label>
    </div>
  );
}
// myData.js
export const projects = [
  {
    id: 1,
    name: "Tic Tac Toe game",
    src: "https://zach-sherin-engagment-photos.s3.us-east-2.amazonaws.com/hello_SD.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQDYQo1ZNPWu6bN4i1oZym75ZyZPU6wVrGoeZh%2B2l0KUMAIhAL1Yt0iX5sBo6QuRjLgMMKFI8AfJboec3TsFlSoZ5ukpKu0CCLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMTc2MzA0MzY0MTMwIgwyQWwjLj6SRxVZf%2BkqwQKEh9x8zG1Ba2isbY56PmUvkAg6y4%2Ft5Kqr%2BYqogkhWe%2BifybgwNxesthagGMiCytcf2WJ%2BRmGKD%2Frw9ouHvYRaJgu6LzCsfZGNRNCFuCCp1s%2Fg%2FJfgQuWeSSol8Ak%2F%2FXX2X3A%2BpZ%2BL06xe1TsPLEpcCxndtDSwNVd2uG9rVnUQPlPp7u9shHjZPW46XN1CCu3RjCxvA0UXm4pLcUy91L%2BWhFfX4ccxTZBY6phs%2BjDR%2B2IgtPSkhi89uT0cMHdK7N0Zx%2BRLuS7oZU1MbuKasDlVedMi8htBgAe53j5Mx%2BSuAmpcYNwXbSb9BUnRaHY8qgHfHgWkx8v6mF2bgsA5zzldUgd4%2FTiyqVMAAnC3dNQxvEHAFdKQUcexTUpyb1fGvGL61cCXa7LSkV83meY41qvoWctGT26EG9oE8Ah2a0E317Uw5%2FqjqAY6sgIo3rzmxphpfpTpFaRzHQ38T2fY%2BjgRlNc5fVXPzpUl171oWoHOoVXU9%2BgD7e%2Br974AXaQUl%2B4pUcN4c%2BHkqwyhgqK6MuNK4ZX0qVcp6JCqDW%2F6b32z%2BFbET%2B5zgQ0Xsj8UAB1wQR6jhVRW8E07ObwFM70qnTRIAD5LtjwpUDyMQ1PfMBP%2FMiLHUasrVgkTZLEC%2BYo4Mk5eIp4ZCOD3EnWKOG5WooBa5YzzYgmilck5slJOct3GXdvGrvUdbqRcCCPous0LtJTWXdtd1ao4D9mWZIyCAXdR%2F4N%2Br1QNDtTCaogkTn3l44KIzHiSMrNR80IkGlnMU%2FjSZuUZruXpEqEfo1uMWOHyyMmwZMBjq84h7y3%2BP9LtgwcHqfIbvAI2ez8jpcnZ6m9tA5cGJLc0UfAL2GA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230919T023517Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIASSDEPDJRFULW4OKH%2F20230919%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=5984945fd23c570fd2611f01ca2b6241b4a11791bf20b1a67cc2cb64b9bb2c0e"
  },
  {
    id: 2,
    name: "Tic Tac Toe game",
    src: "https://zach-sherin-engagment-photos.s3.us-east-2.amazonaws.com/hello_SD.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQDYQo1ZNPWu6bN4i1oZym75ZyZPU6wVrGoeZh%2B2l0KUMAIhAL1Yt0iX5sBo6QuRjLgMMKFI8AfJboec3TsFlSoZ5ukpKu0CCLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMTc2MzA0MzY0MTMwIgwyQWwjLj6SRxVZf%2BkqwQKEh9x8zG1Ba2isbY56PmUvkAg6y4%2Ft5Kqr%2BYqogkhWe%2BifybgwNxesthagGMiCytcf2WJ%2BRmGKD%2Frw9ouHvYRaJgu6LzCsfZGNRNCFuCCp1s%2Fg%2FJfgQuWeSSol8Ak%2F%2FXX2X3A%2BpZ%2BL06xe1TsPLEpcCxndtDSwNVd2uG9rVnUQPlPp7u9shHjZPW46XN1CCu3RjCxvA0UXm4pLcUy91L%2BWhFfX4ccxTZBY6phs%2BjDR%2B2IgtPSkhi89uT0cMHdK7N0Zx%2BRLuS7oZU1MbuKasDlVedMi8htBgAe53j5Mx%2BSuAmpcYNwXbSb9BUnRaHY8qgHfHgWkx8v6mF2bgsA5zzldUgd4%2FTiyqVMAAnC3dNQxvEHAFdKQUcexTUpyb1fGvGL61cCXa7LSkV83meY41qvoWctGT26EG9oE8Ah2a0E317Uw5%2FqjqAY6sgIo3rzmxphpfpTpFaRzHQ38T2fY%2BjgRlNc5fVXPzpUl171oWoHOoVXU9%2BgD7e%2Br974AXaQUl%2B4pUcN4c%2BHkqwyhgqK6MuNK4ZX0qVcp6JCqDW%2F6b32z%2BFbET%2B5zgQ0Xsj8UAB1wQR6jhVRW8E07ObwFM70qnTRIAD5LtjwpUDyMQ1PfMBP%2FMiLHUasrVgkTZLEC%2BYo4Mk5eIp4ZCOD3EnWKOG5WooBa5YzzYgmilck5slJOct3GXdvGrvUdbqRcCCPous0LtJTWXdtd1ao4D9mWZIyCAXdR%2F4N%2Br1QNDtTCaogkTn3l44KIzHiSMrNR80IkGlnMU%2FjSZuUZruXpEqEfo1uMWOHyyMmwZMBjq84h7y3%2BP9LtgwcHqfIbvAI2ez8jpcnZ6m9tA5cGJLc0UfAL2GA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230919T023517Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIASSDEPDJRFULW4OKH%2F20230919%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=5984945fd23c570fd2611f01ca2b6241b4a11791bf20b1a67cc2cb64b9bb2c0e"
  }
];
export default App;
