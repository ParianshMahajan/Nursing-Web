// import * as React from 'react'
import { Box, Stack, Typography } from '@mui/material';
import styles from "./Navbar.module.css"
// import axios from "axios";

export default function Navbar() {
    
    // const[isLogin,setIsLogin]=useState(false);

    // const[userDet,setuserDet]=useState({});
    
    // // const url=config.apiurl+'/user/verify';
    // const [cookies, setCookies, removeCookies] = useCookies();
    // let token = cookies.UserLoggedIn || "";
    // // useEffect(()=>{
    // //     if(token!=""){
    // //         axios.post(url,{token:token})
    // //         .then((res)=>{
    // //             console.log(res.data);
    // //             if(res.status==true){
    // //                 setIsLogin(true);
    // //                 setuserDet({Name:res.data.Name,Email:res.data.Email,})
    // //             }
    // //             else{
    // //                 setIsLogin(false);
    // //             }
    // //         })
    // //     }
    // // },[])

    return (
        <Stack direction='row' sx={{
            background: "rgba( 255, 255, 255, 0.1 )",
            backdropFilter: "blur( 7px )",
            width:1,
            position:'fixed',
            zIndex:100,
            pt:3,
            px:15
        }}
        justifyContent="space-between"
         alignItems='start'
        >
            <p style={{fontSize:"62px", fontWeight:"500",padding:0,margin:0}} 
            className="tapovan"
            >तपोवन्</p>

            <Stack direction='row' alignItems='center' pt={2} gap={4}>
                <Typography sx={{cursor:"pointer","&:hover":{
                    scale:"1.03"
                },transition:"all 0.15s"}} fontSize="22px" fontWeight={540} letterSpacing={1} >Home</Typography>
                <Typography sx={{cursor:"pointer","&:hover":{
                    scale:"1.03"
                },transition:"all 0.15s"}} fontSize="22px" fontWeight={540} letterSpacing={1} >About</Typography>
                <Typography sx={{cursor:"pointer","&:hover":{
                    scale:"1.03"
                },transition:"all 0.15s"}} fontSize="22px" fontWeight={540} letterSpacing={1} >Find Nurses</Typography>
                <Typography sx={{cursor:"pointer","&:hover":{
                    scale:"1.03"
                },transition:"all 0.15s"}} fontSize="22px" fontWeight={540} letterSpacing={1} >Contact Us</Typography>
            </Stack>

            <p style={{fontSize:"32px", fontWeight:"500"}}
            >LOGIN</p>


        </Stack>
    )
}
