import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography } from '@mui/material';

export interface Column<T> {
	key: string;
	label: string;
	width?: number | string;
	render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	total: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (page: number) => void;
	onRowsPerPageChange: (n: number) => void;
	loading?: boolean;
	emptyText?: string;
	rowKey: (row: T) => string;
}

// Shared paginated table for the admin panel (same look as the existing lists).
function AdminTable<T>({ columns, rows, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, loading, emptyText = 'No data', rowKey }: AdminTableProps<T>) {
	return (
		<Box component={'div'} className={'table-wrap admin-shared-table'}>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columns.map((c) => (
								<TableCell key={c.key} style={{ width: c.width }}>
									{c.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={columns.length} align="center">
									<Typography className="muted" sx={{ py: 4 }}>
										{loading ? 'Loading...' : emptyText}
									</Typography>
								</TableCell>
							</TableRow>
						)}
						{rows.map((row) => (
							<TableRow hover key={rowKey(row)}>
								{columns.map((c) => (
									<TableCell key={c.key}>{c.render(row)}</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={total}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(_, p) => onPageChange(p)}
				onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
			/>
		</Box>
	);
}

export default AdminTable;
