import {
  FaWifi,
  FaSnowflake,
  FaTv,
  FaCoffee,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaShieldAlt,
  FaConciergeBell,
} from "react-icons/fa";
import { MdIron, MdLocalLaundryService } from "react-icons/md";
import { GiSlippers, GiBathtub } from "react-icons/gi";

// ── Import room images ────────────────────────────────────────────────────────
// Update paths to match your actual asset filenames
import Room1a from "../../assets/images/room1a.jpg";
import Room1b from "../../assets/images/room1b.jpg";
import Room2a from "../../assets/images/room2a.jpg";
import Room2b from "../../assets/images/room2b.jpeg";
import Room3a from "../../assets/images/room3a.jpg";
import Room3b from "../../assets/images/room3b.jpg";

export const rooms = [
  {
    id: "executive-suite",
    name: "Executive Suite",
    category: "Executive",
    view: "City View",
    price: 37450,
    priceFormatted: "₦37,450",
    rating: 4.5,
    reviewCount: 128,
    size: "35 m²",
    guests: 2,
    beds: "1 King Bed",
    baths: 1,
    description:
      "Indulge in refined luxury with our Executive Suite — a spacious retreat featuring a plush king-size bed, modern décor, and a panoramic city view that sets the tone for an unforgettable Lagos stay.",
    longDescription:
      "Experience comfort and style in our Executive Suite, featuring a breathtaking city view, a luxurious king-size bed, and a sleek walk-in shower. Designed with solo travelers and couples in mind, it's the perfect retreat for relaxation and rejuvenation.\n\nWith 35 m² of thoughtfully designed space, the Executive Suite invites you to immerse yourself in relaxation and bliss. The larger layout creates a serene haven, perfect for unwinding after a busy day or indulging in moments of pure enjoyment.",
    images: [Room1a, Room1b],
    amenities: [
      { icon: <FaWifi />, label: "Free WiFi" },
      { icon: <FaSnowflake />, label: "Air Conditioning" },
      { icon: <FaTv />, label: "Smart TV" },
      { icon: <FaCoffee />, label: "Breakfast" },
      { icon: <FaParking />, label: "Free Parking" },
      { icon: <FaSwimmingPool />, label: "Pool Access" },
    ],
    fullAmenities: [
      { icon: <FaSnowflake />, label: "Air Conditioner" },
      { icon: <FaWifi />, label: "Wifi & Internet" },
      { icon: <GiSlippers />, label: "Slippers" },
      { icon: <FaTv />, label: "Cable TV" },
      { icon: <MdLocalLaundryService />, label: "Towels" },
      { icon: <FaConciergeBell />, label: "Robe" },
      { icon: <FaDumbbell />, label: "Gym Access" },
      { icon: <FaSwimmingPool />, label: "Swimming Pool" },
      { icon: <FaParking />, label: "Free Parking" },
      { icon: <FaShieldAlt />, label: "Safe Box" },
      { icon: <MdIron />, label: "Iron Service" },
      { icon: <GiBathtub />, label: "Cosy Bathroom" },
    ],
    includes: [
      "City View",
      "Wake-up service",
      "Wardrobe",
      "Linen",
      "Reading Desk",
      "Breakfast for One",
    ],
    extraServices: [
      { label: "Daily Housekeeping", price: "Free", note: "NGN0 / Night" },
      { label: "Massage / Spa (Additional Fee)", price: null },
      { label: "Ironing service (Additional Fee)", price: null },
      { label: "Dry cleaning (Additional Fee)", price: null },
      { label: "Laundry (Additional Fee)", price: null },
    ],
    depositAmount: 10000,
    holdHours: 4,
    link: "/rooms/roomdetail/executive-suite",
  },
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    category: "Deluxe",
    view: "Garden View",
    price: 25000,
    priceFormatted: "₦25,000",
    rating: 4.0,
    reviewCount: 94,
    size: "28 m²",
    guests: 2,
    beds: "1 Queen Bed",
    baths: 1,
    description:
      "The Deluxe Room blends comfort and functionality — ideal for solo travellers and couples seeking a relaxing base in the heart of Ogba.",
    longDescription:
      "The Deluxe Room blends comfort and functionality — ideal for solo travellers and couples seeking a relaxing base in the heart of Ogba. Complete with high-speed Wi-Fi and a sleek en-suite bathroom.\n\nEvery detail has been curated to ensure your stay is nothing short of exceptional. From the plush queen-size bed to the modern en-suite, you'll find everything you need to unwind and recharge.",
    images: [Room2a, Room2b],
    amenities: [
      { icon: <FaWifi />, label: "Free WiFi" },
      { icon: <FaSnowflake />, label: "Air Conditioning" },
      { icon: <FaTv />, label: "Smart TV" },
      { icon: <FaDumbbell />, label: "Gym Access" },
    ],
    fullAmenities: [
      { icon: <FaSnowflake />, label: "Air Conditioner" },
      { icon: <FaWifi />, label: "Wifi & Internet" },
      { icon: <FaTv />, label: "Cable TV" },
      { icon: <GiSlippers />, label: "Slippers" },
      { icon: <MdLocalLaundryService />, label: "Towels" },
      { icon: <FaDumbbell />, label: "Gym Access" },
      { icon: <FaShieldAlt />, label: "Safe Box" },
      { icon: <GiBathtub />, label: "En-suite Bathroom" },
    ],
    includes: [
      "Garden View",
      "Wake-up service",
      "Wardrobe",
      "Linen",
      "Reading Desk",
    ],
    extraServices: [
      { label: "Daily Housekeeping", price: "Free", note: "NGN0 / Night" },
      { label: "Ironing service (Additional Fee)", price: null },
      { label: "Laundry (Additional Fee)", price: null },
    ],
    depositAmount: 7500,
    holdHours: 4,
    link: "/rooms/roomdetail/deluxe-room",
  },
  {
    id: "standard-room",
    name: "Standard Room",
    category: "Standard",
    view: "Pool View",
    price: 18500,
    priceFormatted: "₦18,500",
    rating: 3.5,
    reviewCount: 67,
    size: "23 m²",
    guests: 2,
    beds: "1 Double Bed",
    baths: 1,
    description:
      "Our Standard Room offers everything you need for a comfortable stay — a cozy double bed, modern amenities, and the warm hospitality DurbanInternational is known for.",
    longDescription:
      "Our Standard Room offers everything you need for a comfortable stay — a cozy double bed, modern amenities, and the warm hospitality DurbanInternational is known for across Lagos.\n\nPerfect for the budget-conscious traveller who refuses to compromise on comfort. The Standard Room delivers a clean, well-appointed space with all the essentials to make your Lagos visit memorable.",
    images: [Room3a, Room3b],
    amenities: [
      { icon: <FaWifi />, label: "Free WiFi" },
      { icon: <FaSnowflake />, label: "Air Conditioning" },
      { icon: <FaTv />, label: "Smart TV" },
    ],
    fullAmenities: [
      { icon: <FaSnowflake />, label: "Air Conditioner" },
      { icon: <FaWifi />, label: "Wifi & Internet" },
      { icon: <FaTv />, label: "Cable TV" },
      { icon: <MdLocalLaundryService />, label: "Towels" },
      { icon: <GiBathtub />, label: "Bathroom" },
    ],
    includes: ["Pool View", "Wardrobe", "Linen"],
    extraServices: [
      { label: "Daily Housekeeping", price: "Free", note: "NGN0 / Night" },
      { label: "Laundry (Additional Fee)", price: null },
    ],
    depositAmount: 10000,
    holdHours: 4,
    link: "/rooms/roomdetail/standard-room",
  },
];

export const getRoomById = (id) => rooms.find((r) => r.id === id);
