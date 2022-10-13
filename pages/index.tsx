import type { NextPage } from 'next';
import Head from 'next/head';
import { MouseEvent, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';

type Data = {
	n: number;
	px: string;
	pacumulada: string;
	pnegativo: string;
	pacumuladanegativo: string;
	tabela: {
		x: number;
		px: string;
		pacumulada: string;
		pnegativo: string;
		pacumuladanegativo: string;
	}[];
};

type Error = {
	error: string;
};

const Home: NextPage = () => {
	const [data, setData] = useState<Data | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [p, setP] = useState<string>('0');
	const [n, setN] = useState<string>('0');
	const [x, setX] = useState<string>('0');

	const submitDados = async (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();

		const url = `/api/calcular?x=${x}&p=${p}&n=${n}`;
		axios
			.get(url)
			.then((res) => {
				setData(res.data);
				setError(null);
			})
			.catch((error) => {
				setData(null);
				setError(error.response.data.error);
			});
	};

	return (
		<div className={styles.container}>
			<h1>Calculadora de Distribuição Binomial</h1>
			<div className={styles.inputscontainer}>
				<div className={styles.inputbox}>
					<p>Probabilidade de sucesso (0 a 100%):</p>
					<input
						className={styles.input}
						type='number'
						onChange={(change) => setP(change.target.value)}
						value={p}
					/>
				</div>

				<div className={styles.inputbox}>
					<p>Quantidade de observações (n):</p>
					<input
						className={styles.input}
						type='number'
						onChange={(change) => setN(change.target.value)}
						value={n}
					/>
				</div>

				<div className={styles.inputbox}>
					<p>Quantidade de sucessos (x):</p>
					<input
						className={styles.input}
						type='number'
						onChange={(change) => setX(change.target.value)}
						value={x}
					/>
				</div>
			</div>
			<button className={styles.button} onClick={(e) => submitDados(e)}>
				Calcular Probabilidade Comum{' '}
			</button>
			{getTabelaError(error)}
			{getTabelaPrincipal(data)}
			{getTabelaDados(data)}
		</div>
	);
};

function getTabelaPrincipal(dados: Data | null) {
	if (dados === null) {
		return;
	}

	return (
		<div>
			<table className={styles.tabela}>
				<thead>
					<tr>
						<th>Prob.</th>
						<th>Prob. acum.</th>
						<th>1 - Prob.</th>
						<th>1 - Prob acum.</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{dados.px}</td>
						<td>{dados.pacumulada}</td>
						<td>{dados.pnegativo}</td>
						<td>{dados.pacumuladanegativo}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function getTabelaDados(dados: Data | null) {
	if (dados === null) {
		return;
	}

	return (
		<div>
			<table className={styles.tabela}>
				<thead>
					<tr>
						<th>n</th>
						<th>x</th>
						<th>Prob.</th>
						<th>Prob. acum.</th>
						<th>1 - Prob.</th>
						<th>1 - Prob. acum.</th>
					</tr>
				</thead>
				<tbody>
					{dados.tabela.map((item) => {
						return (
							<tr key={item.x}>
								<td>{dados.n}</td>
								<td>{item.x}</td>
								<td>{item.px}</td>
								<td>{item.pacumulada}</td>
								<td>{item.pnegativo}</td>
								<td>{item.pacumuladanegativo}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function getTabelaError(error: string | null) {
	if (!error) {
		return;
	}

	return <div className={styles.error}>{error}</div>;
}

export default Home;
