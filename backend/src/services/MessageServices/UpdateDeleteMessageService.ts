import { getIO } from "../../libs/socket";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";

const UpdateDeleteMessageService = async (id: string): Promise<Message> => {
  await Message.update({
    isDeleted: true,
  }, {
    where: {
      id
    }
  })

  const messageNew = await Message.findOne({
    where: {
      id
    },
    include: [
      {
        model: Ticket,
        as: "ticket",
        include: [
          {
            model: Whatsapp,
            as: "whatsapp",
          },
        ],
      },
    ],
  });

  if (!messageNew) {
    throw new Error("ERR_DELETING_MESSAGE");
  }

  const io = getIO();
  io.to(messageNew.ticketId.toString())
    .to(messageNew.ticket.status)
    .to("notification")
    .emit("appMessage", {
      action: "delete",
      message: messageNew,
      ticket: messageNew.ticket,
      contact: messageNew.ticket.contact
    });

  return messageNew;
};

export default UpdateDeleteMessageService;
