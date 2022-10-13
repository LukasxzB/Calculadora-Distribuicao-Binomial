import React from 'react';
import { NextFunctionComponent } from 'next';

type Props = {
	tabela: {
		x: string;
		px: string;
		pacumulada: string;
		pnegativo: string;
		pacumuladanegativo: string;
	}[];
};

const Tabela: NextFunctionComponent<Props> = ({ tabela }) => {};
