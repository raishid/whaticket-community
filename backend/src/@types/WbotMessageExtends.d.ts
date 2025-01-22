import type { Message } from 'whatsapp-web.js'

export interface TwbotMessage extends Message {
  _data?: MessageData;
}

export interface MessageData {
  id:                                    ID;
  viewed:                                boolean;
  type:                                  string;
  subtype:                               string;
  t:                                     number;
  revokeTimestamp:                       number;
  notifyName:                            string;
  from:                                  string;
  to:                                    string;
  ack:                                   number;
  invis:                                 boolean;
  isNewMsg:                              boolean;
  star:                                  boolean;
  kicNotified:                           boolean;
  recvFresh:                             boolean;
  isFromTemplate:                        boolean;
  pollInvalidated:                       boolean;
  isSentCagPollCreation:                 boolean;
  latestEditMsgKey:                      null;
  latestEditSenderTimestampMs:           null;
  isEventCanceled:                       boolean;
  eventInvalidated:                      boolean;
  isVcardOverMmsDocument:                boolean;
  revokeSender:                          string;
  protocolMessageKey:                    ID;
  labels:                                any[];
  hasReaction:                           boolean;
  ephemeralDuration:                     number;
  ephemeralSettingTimestamp:             number;
  disappearingModeInitiator:             string;
  disappearingModeTrigger:               string;
  disappearingModeInitiatedByMe:         boolean;
  viewMode:                              string;
  messageSecret:                         { [key: string]: number };
  inviteGrpType:                         string;
  isSendFailure:                         boolean;
  errorCode:                             string;
  productHeaderImageRejected:            boolean;
  lastPlaybackProgress:                  number;
  isDynamicReplyButtonsMsg:              boolean;
  isCarouselCard:                        boolean;
  parentMsgId:                           null;
  callSilenceReason:                     null;
  isVideoCall:                           boolean;
  isMdHistoryMsg:                        boolean;
  stickerSentTs:                         number;
  isAvatar:                              boolean;
  lastUpdateFromServerTs:                number;
  invokedBotWid:                         null;
  bizBotType:                            null;
  botResponseTargetId:                   null;
  botPluginType:                         null;
  botPluginReferenceIndex:               null;
  botPluginSearchProvider:               null;
  botPluginSearchUrl:                    null;
  botPluginSearchQuery:                  null;
  botPluginMaybeParent:                  boolean;
  botReelPluginThumbnailCdnUrl:          null;
  botMsgBodyType:                        null;
  requiresDirectConnection:              boolean;
  bizContentPlaceholderType:             null;
  hostedBizEncStateMismatch:             boolean;
  senderOrRecipientAccountTypeHosted:    boolean;
  placeholderCreatedWhenAccountIsHosted: boolean;
  links:                                 any[];
}

export interface ID {
  fromMe:      boolean;
  remote:      string;
  id:          string;
  _serialized: string;
}
