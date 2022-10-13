import { unwatchFile } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export default function calcular(
	req: NextApiRequest,
	res: NextApiResponse<Data | Error>
) {
	const { query } = req;

	const p = Number(query.p) / 100;
	const n = Number(query.n);
	const x = Number(query.x);

	if (p === 0 && n === 0 && x === 0) {
		res.status(400).json({ error: 'Os valores não podem ser 0!' });
		return;
	}

	if (isNaN(p) || isNaN(n) || isNaN(x)) {
		res.status(400).json({ error: 'Insira valores numéricos válidos!' });
		return;
	}

	if (!isInteiro(n) || !isInteiro(x) || n < 0 || x < 0) {
		res.status(400).json({
			error:
				'A quantidade de observações e sucessos devem ser números inteiros e positivos!',
		});
		return;
	}

	if (p < 0 || p > 1) {
		res.status(400).json({
			error:
				'A probabilidade de sucesso não deve ser menor que 0% ou maior que 100%!',
		});
		return;
	}

	if (x > n) {
		res.status(400).json({
			error:
				'A quantidade de sucessos não deve ser maior que a quantidade de observações!',
		});
		return;
	}

	const q = 1 - p;

	const px = getPx(p, x, q, n);
	const pacumulada = getProbabilidadeAcumulada(p, x, q, n);

	const response: Data = {
		n,
		px: (px * 100).toFixed(4) + '%',
		pacumulada: (pacumulada * 100).toFixed(4) + '%',
		pnegativo: ((1 - px) * 100).toFixed(4) + '%',
		pacumuladanegativo: ((1 - pacumulada) * 100).toFixed(4) + '%',
		tabela: [],
	};

	for (let X = 0; X <= n; X++) {
		const prob = getPx(p, X, q, n);
		const probAcumulada = getProbabilidadeAcumulada(p, X, q, n);

		response.tabela.push({
			x: X,
			px: (prob * 100).toFixed(4) + '%',
			pacumulada: (probAcumulada * 100).toFixed(4) + '%',
			pnegativo: ((1 - prob) * 100).toFixed(4) + '%',
			pacumuladanegativo: ((1 - probAcumulada) * 100).toFixed(4) + '%',
		});
	}

	res.status(200).json(response);
}

function isInteiro(numero: number) {
	return parseInt(numero.toString()) === numero;
}

function fatorial(num: number): number {
	if (num == 0) return 1;
	else return num * fatorial(num - 1);
}

function getProbabilidade(p: number, x: number, q: number, n: number) {
	return p ** x * q ** (n - x);
}

function getCombinacoes(n: number, x: number) {
	return fatorial(n) / (fatorial(x) * fatorial(n - x));
}

function getPx(p: number, x: number, q: number, n: number) {
	return getCombinacoes(n, x) * getProbabilidade(p, x, q, n);
}

function getProbabilidadeAcumulada(p: number, x: number, q: number, n: number) {
	let probabilidadeAcumulada = 0;

	for (let X = 0; X <= x; X++) {
		probabilidadeAcumulada += getPx(p, X, q, n);
	}

	return probabilidadeAcumulada;
}
