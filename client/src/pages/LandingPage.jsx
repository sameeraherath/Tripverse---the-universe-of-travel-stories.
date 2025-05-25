import { Button, Typography, Container, Box, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Group, Public, Star, ArrowForward } from "@mui/icons-material";

const stats = [
  { label: "Active Travelers", value: "50K+" },
  { label: "Stories Shared", value: "2.3M+" },
  { label: "Countries Covered", value: "195" },
  { label: "Community Rating", value: "4.9★" },
];

const LandingPage = () => {
  return (
    <Box className="min-h-screen flex flex-col" sx={{ background: "#FFF9F3" }}>
      {/* Navbar Placeholder */}
      <Box sx={{ height: { xs: 56, sm: 64 } }} />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 4, md: 10 } }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
          direction={{ xs: "column-reverse", md: "row" }}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "#111",
                mb: 2,
                fontSize: { xs: 28, sm: 32, md: 48 },
                lineHeight: 1.15,
              }}
            >
              Share Your Travel Stories with the World
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#444",
                mb: 4,
                fontSize: { xs: 16, sm: 18, md: 20 },
              }}
            >
              Connect with fellow travelers, share your adventures, and discover
              incredible destinations through authentic stories from real
              explorers.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Button
                component={Link}
                to="/LoginPage"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#FF7A1A",
                  color: "#fff",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 4,
                  boxShadow: "none",
                  width: { xs: "100%", sm: "auto" },
                  mb: { xs: 1, sm: 0 },
                  "&:hover": { backgroundColor: "#FF6600" },
                  textTransform: "none",
                }}
                endIcon={<ArrowForward />}
              >
                Start Sharing Stories
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Star sx={{ color: "#FFD700", fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{ color: "#222", fontSize: { xs: 13, sm: 15 } }}
              >
                4.9/5 &nbsp;·&nbsp; Free to join &nbsp;·&nbsp; No ads
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                height: { xs: 180, sm: 220, md: 260 },
                background: "#F3F4F6",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Placeholder for hero image or illustration */}
              <Typography
                variant="h6"
                sx={{ color: "#bbb", fontSize: { xs: 14, sm: 16 } }}
              >
                [ Travel Story Preview ]
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "#fff",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  boxShadow: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Edit sx={{ color: "#FF7A1A", fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FF7A1A",
                    fontWeight: 600,
                    fontSize: { xs: 12, sm: 14 },
                  }}
                >
                  2.3M+ Stories Shared
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111",
            textAlign: "center",
            mb: 2,
            fontSize: { xs: 22, sm: 28, md: 32 },
          }}
        >
          Everything You Need to Share Your Journey
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#444",
            textAlign: "center",
            mb: 6,
            fontSize: { xs: 15, sm: 17, md: 20 },
          }}
        >
          Our platform provides all the tools you need to create, share, and
          discover amazing travel experiences.
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: 180,
              }}
            >
              <Edit sx={{ color: "#FF7A1A", fontSize: 40, mb: 1 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 16, sm: 18 } }}
              >
                Rich Story Editor
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
              >
                Create beautiful travel stories with our intuitive editor. Add
                photos, maps, and interactive elements.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: 180,
              }}
            >
              <Group sx={{ color: "#3B82F6", fontSize: 40, mb: 1 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 16, sm: 18 } }}
              >
                Travel Community
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
              >
                Connect with like-minded travelers, follow your favorite
                storytellers, and build lasting friendships.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: 180,
              }}
            >
              <Public sx={{ color: "#22C55E", fontSize: 40, mb: 1 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 16, sm: 18 } }}
              >
                Destination Discovery
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
              >
                Discover hidden gems and popular destinations through authentic
                stories from fellow travelers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Steps Section */}
      <Box sx={{ background: "#F8FAFC", py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: 18, sm: 22, md: 26 },
            }}
          >
            Start Sharing in 3 Simple Steps
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 4,
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: 180,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    background: "#FFEDD5",
                    color: "#FF7A1A",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  1
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 15, sm: 17 } }}
                >
                  Create Your Profile
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
                >
                  Sign up and create your traveler profile. Add your bio, travel
                  interests, and dream destinations.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 4,
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: 180,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    background: "#DBEAFE",
                    color: "#3B82F6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  2
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 15, sm: 17 } }}
                >
                  Write Your Story
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
                >
                  Use our rich editor to craft your travel story. Add photos,
                  videos, and interactive maps to bring it to life.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 4,
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: 180,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    background: "#DCFCE7",
                    color: "#22C55E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  3
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 15, sm: 17 } }}
                >
                  Share & Connect
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", fontSize: { xs: 13, sm: 15 } }}
                >
                  Publish your story and connect with travelers worldwide. Get
                  feedback, tips, and inspiration for your next trip.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Community Stats Section */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #FF7A1A 0%, #FFB347 100%)",
          py: { xs: 4, md: 8 },
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 4,
              fontSize: { xs: 22, sm: 28, md: 32 },
            }}
          >
            Join Our Global Community
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              mb: 6,
              fontSize: { xs: 15, sm: 17, md: 20 },
            }}
          >
            Connect with travelers from every corner of the world and share your
            passion for exploration.
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {stats.map((stat) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 0 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 20, sm: 28, md: 32 },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      opacity: 0.9,
                      fontSize: { xs: 13, sm: 15 },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{ background: "#FFF9F3", py: 3, borderTop: "1px solid #F3F4F6" }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#888", textAlign: { xs: "center", sm: "left" } }}
          >
            © {new Date().getFullYear()} WanderTales. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#888", cursor: "pointer" }}
            >
              Terms of Service
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#888", cursor: "pointer" }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#888", cursor: "pointer" }}
            >
              Contact
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#888", cursor: "pointer" }}
            >
              Help
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
