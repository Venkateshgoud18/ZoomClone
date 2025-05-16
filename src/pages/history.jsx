import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  Box,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  Divider
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // IMPLEMENT SNACKBAR
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => routeTo('/home')}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Meeting History
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {meetings.length ? (
          <Grid container spacing={3}>
            {meetings.map((e, i) => (
              <Grid item xs={12} sm={6} md={6} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 6 }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Meeting Code: {e.meetingCode}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography color="text.secondary">Date: {formatDate(e.date)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No meetings found.
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
