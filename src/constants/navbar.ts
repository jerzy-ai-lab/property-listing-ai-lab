export type Link = {
  to: string;
  label: string;
};

export const MAIN_LINKS: Link[] = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const AUTHENTICATED_LINKS: Link[] = [
  { to: "/bookings", label: "My Bookings" },
  { to: "/add-listing", label: "Add Listing" },
  { to: "/profile", label: "Profile" },
];

export const AUTH_LINK: Link[] = [{ to: "/sign-in", label: "Sign In" }];
