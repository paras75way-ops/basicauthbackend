# basicauthbackend
# 🗂 Offline-First Kanban Task Manager

A full-stack **offline-first Kanban board** built with **React**, **Dexie.js**, **Express**, and **MongoDB**.  
Supports **creating, editing, deleting, and moving tasks between columns via drag & drop**, with **offline synchronization** when the network is available.

---

 

## Features

- **Task CRUD:** Create, edit, and delete tasks.  
- **Drag & Drop:** Move tasks between columns with visual feedback.  
- **Offline-first:** Works offline using **Dexie.js**; changes sync when online.  
 
- **Conflict-free Updates:** Handles task ordering and column moves without data loss.  
- **Rate Limiting:** Protects API endpoints from abuse (e.g., login attempts, task updates).  

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Dexie.js, dnd-kit |
| Backend | Node.js, Express.js, Mongoose, MongoDB |
| Authentication | JWT / Basic Auth |
| Dev Tools | ESLint, Prettier, TypeScript |Nodemom |morgan

---

## Project Structure
