"use client";

import React, { useState, useRef } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Card,
  CardBody,
  Image,
  Link,
  Tooltip,
} from "@nextui-org/react";
import {
  Plane,
  Calendar,
  Wallet,
  Users,
  MapPin,
  Send,
  Coffee,
  Palmtree,
  Tent,
  Utensils,
} from "lucide-react";
import { Input } from "@nextui-org/input";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Progress } from "@nextui-org/progress";
import TripItinerary from "@/components/tripIternary";

import {
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/service/AiModal";
interface FormData {
  destination: string;
  duration: string;
  budget: string;
  companions: string;
}

export default function PlanYourTrip() {
  const [progress, setProgress] = useState(0);
    const router = useRouter();

  const { toast } = useToast();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAn9boxE_fb3x0d3heoR34ZtNrjUghDq4g",
    libraries: ["places"],
  });

  const inputRef = useRef<any>(null);

  const [formData, setFormData] = useState<FormData>({
    destination: "",
    duration: "",
    budget: "",
    companions: "",
  });

  const [tripData, setTripData] = useState<any>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);


  const handleInputChange = (name: string, value: string) => {
    setFormData((prev: FormData) => {
      const updatedData = { ...prev, [name]: value };
      calculateProgress(updatedData); // Update progress after every change
      return updatedData;
    });
  };

  const calculateProgress = (updatedData: FormData) => {
    const totalFields = Object.keys(updatedData).length;
    const filledFields = Object.values(updatedData).filter(
      (value) => value
    ).length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        {children}
      </motion.div>
    );
  };

  const budgetOptions = [
    {
      key: "low",
      label: "Economical",
      icon: <Coffee className="text-brown-600 mr-2" />,
    },
    {
      key: "medium",
      label: "Comfortable",
      icon: <Utensils className="text-green-600 mr-2" />,
    },
    {
      key: "high",
      label: "Luxurious",
      icon: <Wallet className="text-yellow-600 mr-2" />,
    },
  ];

  const companionOptions = [
    {
      key: "solo",
      label: "Solo quest",
      icon: <Plane className="text-blue-600 mr-2" />,
    },

    {
      key: "family",
      label: "Family Fun",
      icon: <Palmtree className="text-green-600 mr-2" />,
    },
    {
      key: "friends",
      label: "Friend Group",
      icon: <Tent className="text-orange-600 mr-2" />,
    },
  ];

  const handlePlacesChanged = () => {
    const places = inputRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];

      const addressComponents = place.address_components;

      let country = "";
      addressComponents.forEach((component: any) => {
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      });

      const locationName = place.name || place.formatted_address; // Get place name or address
      setFormData((prev: FormData) => ({
        ...prev,
        destination: locationName + ", " + country,
      }));
      console.log("Selected Location:", locationName, country);
    }
  };

  const submitData = async () => {
    const { destination, duration, budget, companions } = formData;
  
    if (!destination || !duration || !budget || !companions) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all the fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
  
    toast({
      title: "Generating Itinerary",
      description: "Please wait while we prepare your adventure.",
    });
  
    console.log("Form Data Submitted:", formData);
  
    const finalPrompt = `Generate Travel Plan for Location: ${destination}, for ${duration} Days for ${companions} with a ${budget} budget, Give me a Hotel options(hotelOptions) list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary(itinerary) with places along with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the locations for 3 days with each day plan with best time to visit in JSON format. remove comment lines in JSON, include notes at the end`;
  
    console.log(finalPrompt);
  
    try {
      const result = await chatSession.sendMessage(finalPrompt);
      const textResponse = await result?.response?.text(); // Wait for the response text
  
      console.log("Fetched Data:", textResponse);
  
      if (textResponse) {
        setTripData(JSON.parse(textResponse)); // Parse JSON if it's a valid response
        setIsSubmit(true);
      } else {
        console.error("Error: Empty response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to generate the itinerary. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 text-gray-800">
      <Navbar className="bg-white/70 backdrop-blur-md" maxWidth="xl">
        <NavbarBrand onClick={() => router.push("/")} className="cursor-pointer">
          <Plane className="h-8 w-8 text-purple-600 mr-2" />
          <div className="font-bold text-inherit text-purple-600">
            Nomad Navigator
          </div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              color="secondary"
              className="bg-purple-400 text-white"
              href="/"
              variant="flat"
            >
              Back to Home
              <IoIosArrowBack />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-futuristic">
              Craft Your Perfect Adventure
            </h1>
            <div className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Let our AI travel wizard conjure up the journey of your dreams.
              Tell us about your ideal getaway, and we&apos;ll weave together an
              unforgettable experience tailored just for you.
            </div>
          </div>
        </AnimatedSection>

        <Progress
          value={progress}
          color="secondary"
          className="mb-5"
          classNames={{
            indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
          }}
          size="lg"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardBody className="p-6">
                <Tooltip
                  content="Where do you want to go?"
                  placement="top-start"
                >
                  <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    <MapPin className="w-8 h-8 mr-2 text-pink-500" />
                    Destination
                  </h2>
                </Tooltip>
                <div className="text-black"></div>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRef.current = ref)}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Input
                      placeholder="e.g., Bali, Paris, New York"
                      value={formData.destination}
                      onValueChange={(value) =>
                        handleInputChange("destination", value)
                      }
                      classNames={{
                        input: "text-gray-800 p-0",
                      }}
                    />
                  </StandaloneSearchBox>
                )}

                <div className="mt-2 text-sm text-gray-500">
                  Let your wanderlust guide you. Beach paradise? Mountain
                  retreat? City adventure?
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardBody className="p-6">
                <Tooltip content="How long is your trip?" placement="top-start">
                  <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    <Calendar className="w-8 h-8 mr-2 text-blue-500" />
                    Duration
                  </h2>
                </Tooltip>
                <Input
                  type="number"
                  placeholder="e.g., 7"
                  labelPlacement="outside"
                  min={1}
                  value={formData.duration}
                  onValueChange={(value) =>
                    handleInputChange("duration", value)
                  }
                />
                <div className="mt-2 text-sm text-gray-500">
                  Whether it&apos;s a quick escape or an extended journey,
                  we&apos;ve got you covered.
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardBody className="p-6">
                <Tooltip
                  content="What's your budget range?"
                  placement="top-start"
                >
                  <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    <Wallet className="w-8 h-8 mr-2 text-green-500" />
                    Budget
                  </h2>
                </Tooltip>
                <div className="grid grid-cols-3 gap-4">
                  {budgetOptions.map((option) => (
                    <div
                      key={option.key}
                      className={`flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.budget === option.key
                          ? "bg-purple-600/60 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      onClick={() => handleInputChange("budget", option.key)}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  From thrifty to lavish, we&apos;ll tailor your trip to your
                  pocket.
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardBody className="p-6">
                <Tooltip
                  content="Who are you traveling with?"
                  placement="top-start"
                >
                  <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    <Users className="w-8 h-8 mr-2 text-orange-500" />
                    Travel Companions
                  </h2>
                </Tooltip>
                <div className="grid grid-cols-3 gap-4">
                  {companionOptions.map((option) => (
                    <div
                      key={option.key}
                      className={`flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.companions === option.key
                          ? "bg-purple-600/60 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        handleInputChange("companions", option.key)
                      }
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Solo explorer or group adventurer? We&apos;ll craft the
                  perfect social setting.
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>

        <AnimatedSection>
          <div className="mt-12 text-center">
            <Button
              color="secondary"
              size="lg"
              className="font-bold text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              endContent={<Send className="ml-2" />}
              onPress={() => submitData()}
            >
              Create My Adventure
            </Button>
            <div className="mt-4 text-sm text-gray-500">
              Get ready for an AI-crafted journey that&apos;s uniquely yours!
            </div>
          </div>
        </AnimatedSection>

        <TripItinerary tripData = {tripData} isSubmit={isSubmit}/>

        <AnimatedSection>
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
              Why Plan with Nomad Navigator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                <CardBody className="p-6 text-center">
                  <Image
                    src="https://img.icons8.com/fluency/96/000000/artificial-intelligence.png"
                    alt="AI-Powered"
                    width={64}
                    height={64}
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-purple-600">
                    AI-Powered Insights
                  </h3>
                  <div className="text-gray-600">
                    Our advanced AI analyzes countless travel data points to
                    create a truly personalized itinerary.
                  </div>
                </CardBody>
              </Card>
              <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                <CardBody className="p-6 text-center">
                  <Image
                    src="https://img.icons8.com/fluency/96/000000/customize.png"
                    alt="Customization"
                    width={64}
                    height={64}
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-purple-600">
                    Tailored to You
                  </h3>
                  <div className="text-gray-600">
                    Every suggestion is curated to match your unique preferences
                    and travel style.
                  </div>
                </CardBody>
              </Card>
              <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                <CardBody className="p-6 text-center">
                  <Image
                    src="https://img.icons8.com/fluency/96/000000/clock.png"
                    alt="Time-Saving"
                    width={64}
                    height={64}
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-purple-600">
                    Save Time, Not Thrills
                  </h3>
                  <div className="text-gray-600">
                    Skip hours of research. Get a comprehensive plan in minutes,
                    leaving more time for adventure.
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="bg-purple-100 text-gray-600 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div>
            &copy; {new Date().getFullYear()} Nomad Navigator. Embark on your
            next adventure with AI-powered precision.
          </div>
        </div>
      </footer>
    </div>
  );
}
