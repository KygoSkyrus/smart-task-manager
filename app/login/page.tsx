"use client";

import { useDebugValue, useEffect } from "react";
import { Anton } from "next/font/google";
import LoginForm from "../../components/LoginForm";

const anton = Anton({ subsets: ["latin"], weight: "400" });

const LoginPage: React.FC = () => {

  useEffect(() => {
    const card = document.querySelector(".card") as HTMLElement;

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (!card) return;

      const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 20;

      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  }, []);

  return (
    <div className="h-screen grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="flex justify-center items-center card" id="ex1">
        <h1
          className={`${anton.className} text-[70px] leading-[0.9] text-center mb-5 card-content`}
          id="ex1-layer"
        >
          <span className="text-[140px] tracking-[0]">TASK</span>
          <br />
          <span className="text-red-400">MANAGER</span>
        </h1>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
