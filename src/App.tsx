import React from 'react'
import { useNavigate } from "react-router-dom";

export default function App() {
	const navigate = useNavigate();
	return (
		<div className="nc-bg">
			{/* Fondo de puntos */}
			<div className="nc-plane nc-plane-bottom" />
			<div className="nc-plane nc-plane-top" />
			<div className="nc-middle" />

			{/* Contenido centrado */}
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
				{/* LOGO */}
				<img
					src="/images/logoem.png"
					alt="Nariño Challenge 2025"
					className="w-[260px] sm:w-[340px] md:w-[420px] max-w-full select-none logo-animate"
				/>

				{/* Botón Empezar */}
				<button
				onClick={() => navigate("/form")}
					type="button"
					className="
            mt-10 px-8 py-2 text-sm font-semibold text-black
            rounded-md bg-[#ffd438]
            shadow-lg shadow-black/40
            transition-all duration-300 ease-out
            hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,212,56,0.6)]
            active:scale-95
          ">
					Empezar
				</button>

				{/* Texto “Dura 2 minutos” */}
				<p className="mt-2 flex items-center gap-2 text-xs text-slate-200 text-animate">
					<span className="inline-block h-2 w-2 rounded-full border border-slate-300" />
					Dura 5 minutos
				</p>
			</div>
		</div>
	)
}
