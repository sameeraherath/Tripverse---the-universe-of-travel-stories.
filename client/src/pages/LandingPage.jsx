import { Button, Typography, Container, Box, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward, Edit, Psychology, Speed } from "@mui/icons-material";

const LandingPage = () => {
  return (
    <Box className="min-h-screen flex flex-col bg-gradient-to-r from-neutral-900 to-neutral-800">
      {/* Hero Section */}
      <Box className="py-32 pt-34">
        <Container maxWidth="lg">
          <div className="flex flex-col md:flex-row gap-6 items-center ">
            <div className="w-full md:w-1/2">
              <Typography
                variant="h2"
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Elevate Your Writing with AI-Powered Blogging
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-xl mb-8 opacity-90 pt-8 pb-8 px-2"
              >
                Create brilliant content in seconds with an intelligent blogging
                platform
              </Typography>
              <Box className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  component={Link}
                  to="/LoginPage"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: "50px",
                    backgroundColor: "#2d2d2d",
                    textTransform: "none",
                    height: "58px",
                  }}
                >
                  Start Writing For Free
                </Button>
              </Box>
            </div>
            <div className="w-full md:w-1/2 hidden md:block">
              <Box className="relative">
                <Paper
                  elevation={10}
                  sx={{
                    padding: "20px",
                    backgroundColor: "#707070",
                  }}
                >
                  <Box className="p-4 bg-neutral-200 rounded-3xl mb-4">
                    <div className="flex gap-2 mb-2 pt-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <Typography
                      variant="body2"
                      className="text-gray-800 font-mono pt-2"
                    >
                      Generating AI-powered blog post...
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="font-bold mb-2 text-white"
                  >
                    10 Strategies to Grow Your Online Presence
                  </Typography>
                  <Typography variant="body2" className="text-gray-100 pt-2">
                    In today&apos;s digital landscape, establishing a strong
                    online presence is crucial for...
                  </Typography>
                </Paper>
              </Box>
            </div>
          </div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" className="py-16 pt-28">
        <Typography variant="h4" className=" font-bold text-center mb-12 pb-12">
          Create Compelling Content with AI
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Paper
            elevation={3}
            className="p-6 h-full hover:shadow-lg transition-shadow"
            sx={{
              backgroundColor: "#E8E8E8",
              borderRadius: "25px",
            }}
          >
            <Edit className="text-blue-600 text-4xl mb-4" />
            <Typography variant="h5" className="font-bold mb-2">
              AI-Powered Writing
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Generate high-quality blog posts with a single click. Our AI
              understands your style and creates content that sounds like you.
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            className="p-6 h-full hover:shadow-lg transition-shadow"
            sx={{
              backgroundColor: "#E8E8E8",
              borderRadius: "25px",
            }}
          >
            <Psychology className="text-purple-600 text-4xl mb-4" />
            <Typography variant="h5" className="font-bold mb-2">
              Smart Content Suggestions
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Get intelligent topic recommendations based on trending subjects
              and your audience&apos;s interests.
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            className="p-6 h-full hover:shadow-lg transition-shadow"
            sx={{
              backgroundColor: "#E8E8E8",
              borderRadius: "25px",
            }}
          >
            <Speed className="text-green-600 text-4xl mb-4" />
            <Typography variant="h5" className="font-bold mb-2">
              Publish in Minutes
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Create, edit, and publish content faster than ever before with our
              streamlined workflow and AI assistance.
            </Typography>
          </Paper>
        </div>
      </Container>

      {/* CTA Section */}
      <Box className="bg-gradient-to-r from-neutral-900 to-neutral-800 py-10">
        <Container maxWidth="md">
          <Typography variant="h4" className="text-center">
            Ready to Transform Your Blogging Experience?
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-200 px-2 pt-4 text-center"
          >
            Join thousands of content creators who are saving time and producing
            better content with our AI-powered platform.
          </Typography>
          <Box className="flex flex-col  sm:flex-row justify-center items-center gap-4 pt-8 ">
            <Button
              component={Link}
              to="/LoginPage"
              variant="contained"
              size="large"
              sx={{
                borderRadius: "50px",
                backgroundColor: "#2d2d2d",
                textTransform: "none",
                width: "200px",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
