import EmailIcon from "@mui/icons-material/Email";
import FaceIcon from "@mui/icons-material/Face";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Grid, Skeleton } from '@mui/material'
import React from 'react'

const ProfileSkeleton = () => {
  return (
    <Box display="flex" bgcolor="black" flexDirection="column" alignItems="center" p={2}>
                <Skeleton variant="circular" width={200} height={200} sx={{ bgcolor: 'grey.800' }} />
                <Box mt={2} width="100%">
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <Box display="flex" alignItems="center">
                        <FaceIcon  sx={{ color: 'white' }} />
                        <Box ml={2} width="80%">
                          <Skeleton variant="text" width="100%" height={100} sx={{ bgcolor: 'grey.800' }} />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box display="flex" alignItems="center">
                        <EmailIcon sx={{ color: 'white' }} />
                        <Box ml={2} width="80%">
                          <Skeleton variant="text" width="100%" height={100} sx={{ bgcolor: 'grey.800' }} />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box display="flex" alignItems="center">
                        <CalendarMonthIcon sx={{ color: 'white' }} />
                        <Box ml={2} width="80%">
                          <Skeleton variant="text" width="100%" height={100} sx={{ bgcolor: 'grey.800' }} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
  )
}

export default ProfileSkeleton
