'use client';

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Image,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlacesDetails } from "@/service/googleAPI";

type TripData = {
  tripName: string;
  budget: any;
  travelers: any;
  location: string;
  tripDuration: string;
  currency: string;
  hotelOptions: {
    hotelName: string;
    hotelImageUrl: string;
    description: string;
    hotelAddress: string;
    priceRange: {
      low: number;
      high: number;
    };
    rating: number;
  }[];
  itinerary: {
    [key: string]: {
      theme: string;
      bestTimeToVisit: string;
      activities: {
        placeName: string;
        placeImageUrl: string;
        placeDetails: string;
        ticketPricing: string;
        travelTime: string;
      }[];
    };
  };
  notes: string[];
};

const TripItinerary: React.FC<{ tripData: TripData; isSubmit: boolean; tryAgainClick: ()=> void; }> = ({
  tripData,
  isSubmit,
  tryAgainClick,
}) => {
  const [updatedTripData, setUpdatedTripData] = useState(tripData);
  const [locationPhotoURL, setLocationPhotoURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tripData && isSubmit) {
      getPlacePhotosForTrip();
    }
  }, [tripData, isSubmit]);

  const getPlacePhotosForTrip = async () => {
    setIsLoading(true);

    const getPhotos = async (name: string) => {
      try {
        const data = { textQuery: name };
        const result = await getPlacesDetails(data);
        if (result.data?.places?.length > 0) {
          const photos = result.data.places[0]?.photos;
          if (photos && photos.length > 0) {
            const photoName = photos[0]?.name;
            return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=800&key=AIzaSyAn9boxE_fb3x0d3heoR34ZtNrjUghDq4g`
          }
        }
        return "";
      } catch (error) {
        console.error("Error fetching photo:", error);
        return `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(name)}`;
      }
    };

    const locationPhoto = await getPhotos(tripData.location);
    setLocationPhotoURL(locationPhoto);

    const hotelOptionsWithPhotos = await Promise.all(
      (tripData?.hotelOptions || []).map(async (hotel) => {
        const hotelPhoto = await getPhotos(`${hotel.hotelName}, ${tripData.location}`);
        return { ...hotel, hotelImageUrl: hotelPhoto };
      })
    );
    

    const itineraryWithPhotos = Object.fromEntries(
      await Promise.all(
        Object.entries(tripData?.itinerary || {}).map(async ([day, details]) => {
          const activitiesWithPhotos = await Promise.all(
            (details?.activities || []).map(async (place) => {
              const placePhoto = await getPhotos(`${place.placeName}, ${tripData?.location}`);
              console.log(placePhoto);
              return { ...place, placeImageUrl: placePhoto };
            })
          );
          return [day, { ...details, activities: activitiesWithPhotos }];
        })
      )
    );
    

    setUpdatedTripData({
      ...tripData,
      hotelOptions: hotelOptionsWithPhotos,
      itinerary: itineraryWithPhotos,
    });
    setIsLoading(false);
  };

  if (!isSubmit || !updatedTripData) return null;

  return (
    <Card className="w-full max-w-7xl mx-auto my-8 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 ">
      <CardBody className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner size="lg" color="secondary" />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              
              className="space-y-8"
            >
             <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-lg border border-gray-200">
  <img
    src={locationPhotoURL || "/placeholder.svg"}
    alt={updatedTripData.location}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0" />
  <div className="absolute bottom-0 left-0 p-3 text-white z-[100] bg-pink-50 rounded-xl m-2">
    <motion.h1
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-4xl md:text-5xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 "
    >
      {updatedTripData.location}
    </motion.h1>
  </div>
</div>


              <div className="px-8 py-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
                >
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-semibold">Budget</p>
                    <p className="text-lg">{updatedTripData.budget} </p>
                  </div>
                  <div className="bg-pink-100 p-4 rounded-lg">
                    <p className="text-sm text-pink-600 font-semibold">Travelers</p>
                    <p className="text-lg">{updatedTripData.travelers}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-semibold">Duration</p>
                    <p className="text-lg">{updatedTripData.tripDuration}</p>
                  </div>
                  <div className="bg-pink-100 p-4 rounded-lg">
                    <p className="text-sm text-pink-600 font-semibold">Currency</p>
                    <p className="text-lg">{updatedTripData.currency}</p>
                  </div>
                </motion.div>
              </div>

              <div className="px-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Hotel Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {updatedTripData.hotelOptions.map((hotel, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <Image
          src={hotel.hotelImageUrl || "/placeholder.svg"}
          alt={hotel.hotelName}
          className="w-full h-48 object-cover rounded-none"
          width={500}
          height={300}
        />
        <CardBody className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-purple-600">{hotel.hotelName}</h3>
          <p className="text-sm text-gray-600 mb-2 flex-grow">{hotel.description}</p>
          <p className="text-sm"><strong>Address:</strong> {hotel.hotelAddress}</p>
          <p className="text-sm">
            <strong>Price Range:</strong> {hotel.priceRange.low} - {hotel.priceRange.high} {updatedTripData.currency}
          </p>
          <p className="text-sm"><strong>Rating:</strong> {hotel.rating} ⭐</p>
          <Button
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            onPress={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ' ' + hotel.hotelAddress)}`, "_blank")}
          >
            View on Map
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  ))}
</div>

              </div>

              <div className="px-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Itinerary</h2>
                {Object.entries(updatedTripData.itinerary).map(([day, details], index) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="mb-6 overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                        <h3 className="text-xl font-semibold">Day {index+1
                          
                          }: {details.theme}</h3>
                      </CardHeader>
                      <CardBody className="p-4">
                        <p className="mb-4"><strong>Best Time to Visit:</strong> {details.bestTimeToVisit}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {details.activities.map((place, idx) => (
                            <Card key={idx} className="hover:shadow-md transition-shadow duration-300">
                              <div className="flex justify-center items-center w-full mt-2"> <Image
                                src={place.placeImageUrl || "/placeholder.svg"}
                                alt={place.placeName}
                                className="w-full h-48 object-cover"
                                width={500} // Define the width
  height={300} // Define the height
                                
                              /></div>
                             
                              <CardBody className="p-4">
                                <h4 className="text-lg font-semibold mb-2 text-purple-600">{place.placeName}</h4>
                                <p className="text-sm text-gray-600 mb-2">{place.placeDetails}</p>
                                <p className="text-sm"><strong>Ticket Pricing:</strong> {place.ticketPricing}</p>
                                <p className="text-sm"><strong>Travel Time:</strong> {place.travelTime}</p>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="px-8 pb-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Notes</h2>
                <Card>
                  <CardBody className="p-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {updatedTripData.notes.map((note, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="text-gray-700"
                        >
                          {note}
                        </motion.li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardBody>
      <div className=" flex m-4 mx-6 justify-end ">
      <Button
              
              color="secondary"
              className="bg-purple-400 text-white"
              onPress={tryAgainClick}
              variant="flat"
            >
              Try Again
              
            </Button>
      </div>
     
      
    </Card>
  );
};

export default TripItinerary;
