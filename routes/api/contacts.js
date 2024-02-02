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
  try {
    const contacts = await listContacts(req.user);
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

router.get("/:contactId", auth, async (req, res, next) => {
  try {
    const contactById = await getContactById(req.params.contactId, req.user);
    if (contactById == null) {
      return res.status(400).json({ message: "Not found" });
    } else {
      return res.json(contactById);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

router.patch("/:contactId/favorite", auth, async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

router.delete("/:contactId", auth, async (req, res, next) => {
  try {
    const contactDeleted = await removeContact(req.params.contactId, req.user);
    if (contactDeleted != null) {
      return res.json({ message: "Contact deleted" });
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

router.put("/:contactId", auth, async (req, res, next) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
