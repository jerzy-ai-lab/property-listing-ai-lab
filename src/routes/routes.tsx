import { lazy, Suspense } from "react";

/** Route params for /property/:id */
export type PropertyDetailsParams = { id: string };
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App } from "@/App";
import { Spinner } from "@/components/Spinner/Spinner";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary/RouteErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { fetchProperties, fetchPropertyById } from "@/api/properties";

/* Route loaders */
const propertiesLoader = async ({ request }: { request: Request }) => {
  const properties = await fetchProperties(request.signal);
  return { properties };
};

const propertyLoader = async ({
  params,
  request,
}: {
  params: { id?: string };
  request: Request;
}) => {
  const id = params.id;
  if (!id) {
    throw new Response("Property ID is required", { status: 400 });
  }
  const property = await fetchPropertyById(id, request.signal);
  if (!property) {
    throw new Response("Property not found", { status: 404 });
  }
  return { property };
};

const homeLoader = async ({ request }: { request: Request }) => {
  const properties = await fetchProperties(request.signal);
  return { properties };
};

/* Authentication pages – lazy loaded */
const SignIn = lazy(() =>
  import("@/pages/SignIn/SignIn").then((m) => ({ default: m.SignIn })),
);
const SignUp = lazy(() =>
  import("@/pages/SignUp/SignUp").then((m) => ({ default: m.SignUp })),
);
const ResetPassword = lazy(() =>
  import("@/pages/ResetPassword/ResetPassword").then((m) => ({
    default: m.ResetPassword,
  })),
);
const EmailVerification = lazy(() =>
  import("@/pages/EmailVerification/EmailVerification").then((m) => ({
    default: m.EmailVerification,
  })),
);

/* Content pages – lazy with named exports */
const Home = lazy(() =>
  import("@/pages/Home/Home").then((m) => ({ default: m.Home })),
);
const PropertyList = lazy(() =>
  import("@/pages/PropertyList/PropertyList").then((m) => ({
    default: m.PropertyList,
  })),
);
const PropertyDetails = lazy(() =>
  import("@/pages/PropertyDetails/PropertyDetails").then((m) => ({
    default: m.PropertyDetails,
  })),
);
const About = lazy(() =>
  import("@/pages/About/About").then((m) => ({ default: m.About })),
);
const Contact = lazy(() =>
  import("@/pages/Contact/Contact").then((m) => ({ default: m.Contact })),
);

/* Protected pages */
const Bookings = lazy(() =>
  import("@/pages/Bookings/Bookings").then((m) => ({ default: m.Bookings })),
);
const AddListing = lazy(() =>
  import("@/pages/AddListing/AddListing").then((m) => ({
    default: m.AddListing,
  })),
);
const Profile = lazy(() =>
  import("@/pages/Profile/Profile").then((m) => ({ default: m.Profile })),
);

/* Error page */
import { NotFound } from "@/pages/NotFound/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      }
      hydrateFallbackElement={<Spinner />}
    >
      {/* Public routes */}
      <Route
        index
        loader={homeLoader}
        errorElement={<RouteErrorBoundary />}
        element={
          <Suspense fallback={<Spinner />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/properties"
        loader={propertiesLoader}
        errorElement={<RouteErrorBoundary />}
        element={
          <Suspense fallback={<Spinner />}>
            <PropertyList />
          </Suspense>
        }
      />
      <Route
        path="/property/:id"
        loader={propertyLoader}
        errorElement={<RouteErrorBoundary />}
        element={
          <Suspense fallback={<Spinner />}>
            <PropertyDetails />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<Spinner />}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<Spinner />}>
            <Contact />
          </Suspense>
        }
      />
      {/* Auth flow routes */}
      <Route
        path="/sign-up"
        element={
          <Suspense fallback={<Spinner />}>
            <SignUp />
          </Suspense>
        }
      />
      <Route
        path="/sign-in"
        element={
          <Suspense fallback={<Spinner />}>
            <SignIn />
          </Suspense>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Suspense fallback={<Spinner />}>
            <ResetPassword />
          </Suspense>
        }
      />
      <Route
        path="/email-verification"
        element={
          <Suspense fallback={<Spinner />}>
            <EmailVerification />
          </Suspense>
        }
      />
      {/* Protected routes */}

      <Route
        path="/bookings"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-listing"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <AddListing />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        }
      />
      {/* Error page */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
