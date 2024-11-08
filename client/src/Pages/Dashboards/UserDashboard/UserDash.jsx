import { Box, Button, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const UserDash = () => {
  const userDetails = {
    name: "John Doe",
  };
  const chats = [
    "Sophia",
    "Jackson",
    "Olivia",
    "Liam",
    "Emma",
    "Noah",
    "Ava",
    "Aiden",
    "Isabella",
    "Lucas",
    "Mia",
    "Ethan",
    "Amelia",
    "James",
    "Harper",
    "Benjamin",
    "Ella",
    "Mason",
    "Charlotte",
    "Elijah",
  ];

  const defaultUser="https://i.imgur.com/NsvGTlj.png"

  return (
    <Box
      sx={{ background: "#F0F9FF", pt: "120px", px: 9,minHeight:"100vh",mb:"5%" }}
    >
      <Typography variant="h3">
        Hi!{" "}
        <span style={{ color: "rgb(6, 157, 181)" }}>{userDetails.name}</span>{" "}
      </Typography>

      <Stack
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mt: 5 }}
      >
        <Box width="60%">

          <Paper sx={{width:1,p:2,borderRadius:4,mb:"5%", minHeight:"40vh"}}>
            <Typography variant="h5" fontSize="26px">Current Contracts</Typography>
          </Paper>


          <Paper elevation={10} sx={{ width: "1", p: 2, borderRadius: 5 }}>
            <Stack
              // sx={{ border: "1px dashed #747474", borderRadius: 4 }}
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Box width={0.32}>
                <Typography
                  variant="h5"
                  px={2}
                  pt={2}
                  fontSize="32px"
                  fontWeight={500}
                  color="rgb(6, 157, 181)"
                >
                  Chats
                </Typography>
                <Divider
                  sx={{ width: 1, border: "1px solid #747474", mt: 2 }}
                />

                <Box
                  height="53vh"
                  sx={{ overflowY: "auto" }}
                  p={2}
                  mt={1}
                  pt={0}
                  mr={0.1}
                >
                  {chats.map((chat, idx) => {
                    return (
                      <Box
                        key={chat}
                        p={2}
                        borderBottom={
                          idx !== chats.length - 1 ? "1px solid #b2b2b2" : ""
                        }
                        fontSize="20px"
                        sx={{ cursor: "pointer" }}
                      >
                        {chat}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ border: "1px solid #b2b2b2", mt: 2 }}
              />

              <Box width={0.68}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{px:3,pt:1}}>
                  <Stack direction="row" alignItems="center">

                    <Box sx={{borderRadius:"50%",height:"50px",aspectRatio:"1/1",backgroundImage:`url(${defaultUser})`,backgroundSize:"cover",backgroundPosition:"center"}}></Box>
                    <Typography variant="h5" pt={0.3} pl={3} fontSize="26px"
                      fontWeight={500}> 
                      John Doe
                    </Typography>
                    </Stack>

                    <IconButton size="large" >
                      <MoreVertIcon/>
                    </IconButton>

                </Stack>
                
                
                <Divider
                  sx={{ width: 1, border: "1px solid #747474", mt: 2 }}
                />
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Paper elevation={10} sx={{ width: "28%", p: 2, borderRadius: 5 }}>
          <Typography
            variant="h5"
            fontSize="32px"
            fontWeight={500}
            color="rgb(6, 157, 181)"
          >
            Requests Sent
          </Typography>
          <Divider sx={{ width: 1, border: "1px solid black", mt: 1 }} />

          <Box height="40vh" sx={{ overflowY: "auto" }} p={2} pt={1} mr={0.1}>
            {chats.map((chat, idx) => {
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  key={chat}
                  p={1}
                  borderBottom={
                    idx !== chats.length - 1 ? "1px solid #b2b2b26b" : ""
                  }
                  fontSize="18px"
                  sx={{ cursor: "pointer" }}
                >
                  {chat}
                  <Button
                    endIcon={<CloseIcon />}
                    variant="contained"
                    sx={{
                      background: "#0697ff87",
                      color: "#515151",
                      fontWeight: "600",
                    }}
                    size="small"
                  >
                    Withdraw
                  </Button>
                </Stack>
              );
            })}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default UserDash;
