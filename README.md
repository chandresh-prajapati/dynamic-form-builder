# 📝 Dynamic Form Builder

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

A powerful, robust, and highly customizable React-based Dynamic Form Builder. Create, manage, validate, and respond to fully tailored forms natively on the browser. Features a beautifully executed drag-and-drop user interface built strictly with modern Web Standards to seamlessly design schemas and track form responses.

---

## ✨ Features

- **Interactive Drag & Drop Builder:** Effortlessly organize and shape your form structure utilizing `@dnd-kit`.
- **Advanced State Management:** Deep configuration control leveraging the capabilities of `Zustand`.
- **Robust Client Validation:** Seamless integration of `react-hook-form` coupled with dynamic validation schemas dynamically built through `Zod`.
- **Premium Interface & Theming:** Modern, cohesive visual hierarchy constructed via Material UI (MUI), complete with extended palettes, glassmorphism aesthetics, dynamic micro-animations, and a robust Light/Dark mode. 
- **Mock Persistence API:** Locally simulate backend database interactions effortlessly fetching, resolving, and stringifying complex schema structures directly in `localStorage`.
- **Complex Capabilities Support:** Incorporates logic for handling multi-selection groups, Regex validations, conditional visibility (dependencies), and deeply embedded multi-image `FileList` uploads.
- **Multilingual Hook System (`useI18n`):** Infrastructure natively geared towards seamless language and global string mapping configuration.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) via [Vite](https://vitejs.dev/)
- **UI & Styling**: [Material UI (v6)](https://mui.com/material-ui/) + `@emotion/react`
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) alongside [Zod](https://zod.dev/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Data & State**: [Zustand](https://zustand-demo.pmnd.rs/) (Global UI/Builder State) + [TanStack React Query](https://tanstack.com/query/latest) (API hooks)
- **Tooling**: [ESLint](https://eslint.org/), Date manipulation via `dayjs`.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chandresh-prajapati/dynamic-form-builder.git
   cd dynamic-form-builder
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Navigate to the Application:**  
   Open your browser and navigate to the address presented in your terminal (usually `http://localhost:5173/`).

---

## 💡 Usage Highlights

1. **Dashboard:** Manage your saved forms. Switch views, search schemas, or easily deploy a new instance.
2. **Form Builder Engine:** Create a new setup and modify parameters contextually. Pinpoint detailed aspects like default values, complex logical dependencies ("show if field A equals value X"), and customized Regex constraints.
3. **Responsive Previews:** Ensure your fields cascade gorgeously mimicking a live-app structure through the Preview tab. 
4. **Local Submissions:** Fill out published forms and watch real submissions immediately populate under the Responses tab table (which dynamically manages stringifying generic arrays and parsing Base64 preview avatars)! 

---

## 📄 License & Acknowledgments

This project is built and optimized iteratively focusing on scalability, strict typing paradigms, and premium aesthetic implementation. Open to improvements and open-source contribution adaptations!

<img width="1920" height="1505" alt="screencapture-localhost-5173-2026-04-14-11_28_25" src="https://github.com/user-attachments/assets/063c5f0e-039d-4879-a2f8-6d5726b6037b" />
<img width="1920" height="1505" alt="screencapture-localhost-5173-2026-04-14-11_31_43" src="https://github.com/user-attachments/assets/fdff925e-f93c-464c-8398-4786fe2f991c" />
