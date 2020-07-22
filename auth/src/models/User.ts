import { createSchema, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema({
  email: Type.string({ required: true }),
  password: Type.string({ required: true }),
});

const User = typedModel('User', UserSchema);

export { User };
