import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO = Pick<
  Statement,
  | "user_id"
  | "description"
  | "amount"
  | "type"
  | "sender_user_id"
  | "receiver_user_id"
>;
