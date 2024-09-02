"use client";

import React from "react";
import Link from "next/link";
import { Anton } from "next/font/google";
import { useRouter } from "next/navigation";

const anton = Anton({ subsets: ["latin"], weight: "400" });

const Header: React.FC<{ title?: string; showIcon?: Boolean }> = ({
  title,
  showIcon = false,
}) => {
  const router = useRouter();

  return (
    <div className="flex">
      <div
        className="p-4 m-2 flex justify-between items-center shadow-sm shadow-indigo-100 rounded-md cursor-pointer"
        onClick={() => router.push(`/`)}
      >
        <svg
          className="rotate-180"
          width="24"
          height="24"
          viewBox="0 0 0.45 0.45"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.249.069a.03.03 0 0 1 .042 0l.135.135a.03.03 0 0 1 0 .042L.291.381A.03.03 0 0 1 .249.339L.33.255H.045a.03.03 0 0 1 0-.06H.33L.249.111a.03.03 0 0 1 0-.042" />
        </svg>
      </div>
      <div className="w-full p-4 m-2 flex justify-between items-center shadow-sm shadow-indigo-100 rounded-md">
        <Link href="/">
          <section className={`${anton.className} text-[30px] text-gray-800`}>
            {title}
          </section>
        </Link>
        {showIcon && (
          <Link href={"/settings"}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 0.9 0.9"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
            >
              <path d="M.746.475a.04.04 0 0 1 0-.05L.794.371A.04.04 0 0 0 .798.327L.723.197a.04.04 0 0 0-.04-.018l-.07.014A.04.04 0 0 1 .57.168L.547.099A.04.04 0 0 0 .511.073h-.15a.04.04 0 0 0-.037.026L.303.168A.04.04 0 0 1 .26.193L.188.18a.04.04 0 0 0-.037.018L.075.327a.04.04 0 0 0 .004.044l.048.054a.04.04 0 0 1 0 .05L.079.529a.04.04 0 0 0-.004.044l.075.13a.04.04 0 0 0 .04.018L.26.707a.04.04 0 0 1 .043.025l.023.069a.04.04 0 0 0 .037.026h.15A.04.04 0 0 0 .549.801L.572.732A.04.04 0 0 1 .615.707l.07.014a.04.04 0 0 0 .04-.018L.8.573A.04.04 0 0 0 .796.529ZM.69.525l.03.034-.048.083L.628.633a.11.11 0 0 0-.129.075L.484.75H.388L.375.707A.11.11 0 0 0 .246.632L.202.641.153.558l.03-.034a.11.11 0 0 0 0-.15L.153.34.201.257l.044.009A.11.11 0 0 0 .374.191L.388.15h.096l.014.043a.11.11 0 0 0 .129.075L.671.259l.048.083-.03.034a.11.11 0 0 0 0 .149M.435.3a.15.15 0 1 0 .15.15.15.15 0 0 0-.15-.15m0 .225A.075.075 0 1 1 .51.45a.075.075 0 0 1-.075.075" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
