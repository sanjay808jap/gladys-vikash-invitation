/**
 * WEDDING INVITATION CONFIGURATION
 * 
 * Update all wedding details, scripture, dates, guests, maps, and music here.
 * Any changes made in this file automatically update across the entire website.
 */

const WEDDING_CONFIG = {
  couple: {
    bride: "Gladys Evangeline",
    brideTitle: "Gladys Evangeline",
    groom: "Vikash Varma",
    groomTitle: "Vikash Varma",
    monogram: "G & V",
    hashtag: "#GladysWedsVikash"
  },

  invitationMessage: {
    welcome: "YOU ARE CORDIALLY INVITED",
    subWelcome: "to celebrate the holy matrimony of",
    formalRequest: "With the blessings of family and loved ones, you are warmly invited to share in the joy of this special celebration.",
    closingBlessing: "Your presence will make this celebration even more special.",
    closingSalutation: "WITH LOVE & BLESSINGS"
  },

  scriptures: {
    primary: {
      verse: "She is clothed with strength and dignity; she can laugh at the days to come.",
      reference: "Proverbs 31:25"
    },
    secondary: {
      verse: "The Lord is good to everyone. He showers compassion on all his creation.",
      reference: "Psalms 145:9"
    }
  },

  events: {
    betrothal: {
      title: "BETROTHAL CEREMONY",
      subtitle: "Sacred Promise & Thanksgiving",
      dateString: "Friday, 16 October 2026",
      dayOfWeek: "FRIDAY",
      day: "16",
      month: "OCTOBER",
      year: "2026",
      time: "7:00 PM",
      venueName: "Cantonment Baptist Church",
      hall: "Community Hall",
      city: "Vizianagaram",
      postEventNote: "Dinner follows.",
      calendarStartDate: "2026-10-16T19:00:00+05:30",
      calendarEndDate: "2026-10-16T22:00:00+05:30",
      description: "Betrothal Ceremony of Gladys Evangeline & Vikash Varma at Cantonment Baptist Church Community Hall, Vizianagaram."
    },
    wedding: {
      title: "WEDDING CEREMONY",
      subtitle: "The Holy Matrimony",
      dateString: "Saturday, 17 October 2026",
      dayOfWeek: "SATURDAY",
      day: "17",
      month: "OCTOBER",
      year: "2026",
      time: "10:00 AM",
      venueName: "Cantonment Baptist Church",
      hall: "",
      city: "Vizianagaram",
      postEventNote: "Lunch follows.",
      calendarStartDate: "2026-10-17T10:00:00+05:30",
      calendarEndDate: "2026-10-17T14:00:00+05:30",
      description: "Wedding Ceremony of Gladys Evangeline & Vikash Varma at Cantonment Baptist Church, Vizianagaram."
    }
  },

  specialGuests: [
    {
      category: "Guest of Honour",
      name: "Sis. Shantha Kumari Mondithoka",
      designation: "Dean of Academics",
      organization: "HITHA, Hyderabad"
    },
    {
      category: "Chief Guest",
      name: "Rev. Dr. M. Vijaya Kumar",
      designation: "President",
      organization: "CBCNC"
    }
  ],

  venue: {
    name: "Cantonment Baptist Church",
    city: "Vizianagaram",
    state: "Andhra Pradesh",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cantonment+Baptist+Church+Vizianagaram",
    embedMapQuery: "Cantonment+Baptist+Church+Vizianagaram"
  },

  music: {
    title: "Goodness of God",
    artist: "Bethel Music ft. Jenn Johnson",
    youtubeVideoId: "n0FBb6hnwTo",
    startTimeSeconds: 55,
    autoPlayOnOpen: true,
    initialVolume: 80
  },

  share: {
    whatsappText: "Together with our families, you are cordially invited to celebrate the wedding of Gladys Evangeline & Vikash Varma on 16 & 17 October 2026 at Cantonment Baptist Church, Vizianagaram. Please open the digital invitation: "
  }
};
