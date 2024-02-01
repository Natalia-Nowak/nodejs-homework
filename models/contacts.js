const fs = require("fs/promises");
const { Contact } = require("../modules/contacts/contact.schema");

const listContacts = async (user) => {
  const contacts = await Contact.find({ owner: user.id });
  return contacts;
};

const getContactById = async (contactId, user) => {
  const contact = await Contact.findOne({ _id: contactId, owner: user.id });
  return contact;
};

const removeContact = async (contactId, user) => {
  const result = await Contact.findOneAndDelete({
    _id: contactId,
    owner: user.id,
  });
  return result;
};

const addContact = async (body, user) => {
  const contact = new Contact({
    name: body.name,
    email: body.email,
    phone: body.phone,
    favorite: body.favorite,
    owner: user.id,
  });

  contact.save();
  return contact;
};

const updateContact = async (contactId, body, user) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: user.id,
    },
    {
      $set: {
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    }
  );
  const contact = await Contact.findById(contactId);
  return contact;
};

const updateStatusContact = async (contactId, body, user) => {
  await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: user.id,
    },
    {
      $set: {
        favorite: body.favorite,
      },
    }
  );
  const contact = await Contact.findById(contactId);
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
