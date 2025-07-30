/**
 * Client-only component to register the service worker for offline support.
 */
"use client";
import { useServiceWorker } from "../hooks/useServiceWorker";

const ServiceWorkerRegister = () => {
  useServiceWorker();
  return null;
};

export default ServiceWorkerRegister;
