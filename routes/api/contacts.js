const express = require("express");
const { Contact } = require("../../modules/contacts/contact.schema");
const {
  listContacts,
  getContactById,
  addContact,
  updateStatusContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const { auth } = require("../../modules/auth/auth.middleware");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  const contacts = await listContacts(req.user);
  return res.json(contacts);
});

router.get("/:contactId", auth, async (req, res, next) => {
  const contactById = await getContactById(req.params.contactId, req.user);
  if (contactById == null) {
    return res.status(400).json({ message: "Not found" });
  } else {
    return res.json(contactById);
  }
});

router.post("/", auth, async (req, res, next) => {
  if (
    Object.hasOwn(req.body, "name") &&
    Object.hasOwn(req.body, "email") &&
    Object.hasOwn(req.body, "phone")
  ) {
    await addContact(req.body, req.user);

    return res.status(201).json(req.body);
  } else {
    return res.status(400).json({ message: "missing required name - field" });
  }
});

router.patch("/:contactId/favorite", auth, async (req, res) => {
  console.log(req.body);
  if (req.body == null || !Object.hasOwn(req.body, "favorite")) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const contact = await updateStatusContact(
    req.params.contactId,
    req.body,
    req.user
  );
  return res.json(contact);
});

router.delete("/:contactId", auth, async (req, res, next) => {
  const contactDeleted = await removeContact(req.params.contactId, req.user);
  if (contactDeleted != null) {
    return res.json({ message: "Contact deleted" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", auth, async (req, res, next) => {
  if (
    Object.hasOwn(req.body, "name") ||
    Object.hasOwn(req.body, "email") ||
    Object.hasOwn(req.body, "phone") ||
    Object.hasOwn(req.body, "favorite")
  ) {
    const contactUpdated = await updateContact(
      req.params.contactId,
      req.body,
      req.user
    );
    if (contactUpdated) res.json(contactUpdated);
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
