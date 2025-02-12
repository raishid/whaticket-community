const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
const closeTicketAuto = import.meta.env.VITE_CLOSE_TICKET_AUTO as string;

console.log({
  backendUrl,
  closeTicketAuto,
});

export { backendUrl, closeTicketAuto };
