"use client";

import React from "react";
import { Navbar } from "@nextui-org/navbar";
import { NavbarBrand } from "@nextui-org/navbar";
import { NavbarContent } from "@nextui-org/navbar";
import { NavbarItem } from "@nextui-org/navbar";
import { NavbarMenuToggle } from "@nextui-org/navbar";
import { NavbarMenu } from "@nextui-org/navbar";
import { NavbarMenuItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Card } from "@nextui-org/card";

import { CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

import {
  MapPin,
  Users,
  Wallet,
  Plane,
  Globe,
  Camera,
  Compass,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800">
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/70 backdrop-blur-md"
        maxWidth="xl"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Plane className="h-8 w-8 text-purple-600 mr-2" />
            <p className="font-bold text-inherit text-purple-600">
              Nomad Navigator
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
         
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="secondary" href="#" variant="flat">
              Try Demo
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {["Features", "About"].map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                className="w-full"
                href={`#${item.toLowerCase()}`}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <main className="container mx-auto px-4">
        <AnimatedSection>
          <div className="py-20 text-center">
            <h1 className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-futuristic">
              Navigate Your Dreams
            </h1>
            <p className="text-2xl mb-8 max-w-2xl mx-auto text-gray-600">
              Embark on a journey beyond imagination with Nomad Navigator. Your
              personal AI-powered travel companion.
            </p>
            <Button
              color="secondary"
              size="lg"
              className="font-bold text-lg px-8 py-6"
            >
              Explore Now
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 flex justify-between gap-2">
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80"
              alt="Travel Adventure"
              className="w-full h-[200px] object-cover rounded-3xl shadow-2xl"
            />
            <Image
              src="https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Travel Adventure"
              className="w-full h-[200px] object-cover rounded-3xl shadow-2xl"
            />

            <Image
              src="https://plus.unsplash.com/premium_photo-1697730150003-26a1d469adb4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Travel Adventure"
              className="w-full h-[200px] object-cover rounded-3xl shadow-2xl"
            />

            <Image
              src="https://plus.unsplash.com/premium_photo-1697729701846-e34563b06d47?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Travel Adventure"
              className="w-full h-[200px] object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </AnimatedSection>

        <div id="features" className="py-20">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">
              Redefine Your Journey
            </h2>
          </AnimatedSection>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Globe,
                title: "AI-Powered Itineraries",
                description:
                  "Craft the perfect trip with our intelligent planning assistant.",
              },
              {
                icon: Users,
                title: "Collaborative Adventures",
                description:
                  "Plan and sync with friends in real-time, anywhere in the world.",
              },
              {
                icon: Wallet,
                title: "Smart Budgeting",
                description:
                  "Keep your finances in check with our intuitive expense tracker.",
              },
              {
                icon: Camera,
                title: "Capture Memories",
                description:
                  "Integrate and organize your travel photos seamlessly.",
              },
              {
                icon: MapPin,
                title: "Off-the-beaten-path",
                description:
                  "Discover hidden gems with our curated local insights.",
              },
              {
                icon: Compass,
                title: "Personalized Experiences",
                description:
                  "Tailor your journey to your unique preferences and style.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-white border border-purple-200 hover:border-purple-400 transition-colors duration-300">
                  <CardBody className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Divider className="my-20 bg-purple-200" />

        <div id="about" className="py-20">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">
              About Nomad Navigator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6 text-gray-700">
                  Nomad Navigator is a personal project born out of a passion
                  for travel and technology. As an AI-powered travel companion,
                  it aims to revolutionize the way we plan and experience our
                  journeys.
                </p>
                <p className="text-lg mb-6 text-gray-700">
                  This project showcases my skills in:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>React and Next.js development</li>
                  <li>UI/UX design with Next UI and Tailwind CSS</li>
                  <li>Integration of AI technologies</li>
                  <li>Responsive and accessible web design</li>
                </ul>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Travel Planning"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="py-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">
              Explore the World
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1459231978203-b7d0c47a2cb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
              ].map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Travel destination ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="bg-gray-100 text-gray-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">
                Nomad Navigator
              </h3>
              <p>
                A personal project showcasing AI-powered travel planning and
                seamless user experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">
                Connect With Me
              </h3>
              <p className="mb-4">
                Interested in collaborating or learning more about this project?
              </p>
              <Button as={Link} color="secondary" href="#" variant="flat">
                Contact Me
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-300 text-center">
            <p>
              &copy; {new Date().getFullYear()} Nomad Navigator. Rahul Compani
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
