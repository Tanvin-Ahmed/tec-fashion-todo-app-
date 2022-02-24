import {
	Box,
	Button,
	MenuItem,
	Select,
	TextField,
	Typography,
	FormControl,
	InputLabel,
	Paper,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	Table,
	TableBody,
	Fab,
} from "@mui/material";
import React, { useCallback, useReducer, useState, useEffect } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TodoItem {
	id: number;
	name: string;
	available: string;
	price: number;
}

type ActionType =
	| { type: "ADD"; payload: TodoItem }
	| { type: "REMOVE"; id: number };
type ActionType2 = { type: "ALL"; payload: TodoItem[] };

const Todo = () => {
	const reducer = (state: TodoItem[], action: ActionType | ActionType2) => {
		switch (action.type) {
			case "ALL":
				return action.payload;
			case "ADD":
				localStorage.setItem(
					"todoList",
					JSON.stringify([...state, action.payload])
				);
				return [...state, action.payload];
			case "REMOVE":
				return state.filter(({ id }) => id !== action.id);
		}
	};

	const [todoList, dispatch] = useReducer(reducer, []);
	const [name, setName] = useState<string>("");
	const [isAvailable, setIsAvailable] = useState<string>("");
	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		const json: string | null = localStorage.getItem("todoList");
		if (typeof json !== "string") return;
		const list = JSON.parse(json);
		dispatch({ type: "ALL", payload: list });
	}, []);

	const handleAddTodo = useCallback(
		e => {
			e.preventDefault();
			const payload = {
				id: Math.random(),
				name,
				price,
				available: isAvailable,
			};

			dispatch({ type: "ADD", payload });
			setName("");
			setPrice(0);
			setIsAvailable("");
		},
		[isAvailable, name, price]
	);

	const handleDelete = (id: number) => {
		dispatch({ type: "REMOVE", id });
		const json: string | null = localStorage.getItem("todoList");
		if (typeof json !== "string") return;
		const list = JSON.parse(json);
		const newList = list.filter((item: TodoItem) => item.id !== id);
		localStorage.setItem("todoList", JSON.stringify(newList));
	};

	return (
		<Box component="section">
			<Box component="div" sx={styles.container}>
				<Typography sx={styles.header}>Tec Fashion</Typography>
				<Box component="div" sx={styles.inputContainer}>
					<Typography>Add Product</Typography>
					<Box component="form" sx={styles.form} onSubmit={handleAddTodo}>
						<TextField
							id="filled-basic"
							label="Product name"
							variant="filled"
							value={name}
							onChange={e => setName(e.target.value)}
							required
						/>
						<FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
							<InputLabel>Availability</InputLabel>
							<Select
								value={isAvailable}
								label="Available"
								onChange={e => setIsAvailable(e.target.value)}
								required
							>
								<MenuItem value="available">Available</MenuItem>
								<MenuItem value="unavailable">UnAvailable</MenuItem>
							</Select>
						</FormControl>
						<TextField
							id="filled-basic"
							label="Price"
							variant="filled"
							value={price ? price : null}
							onChange={e => setPrice(parseInt(e.target.value))}
							required
						/>
						<Button
							type="submit"
							variant="contained"
							startIcon={<AddBoxIcon />}
						>
							Add Todo
						</Button>
					</Box>
				</Box>
			</Box>
			<Typography sx={styles.heading}>Product List</Typography>
			<Paper sx={{ width: "100%", overflow: "hidden" }}>
				<TableContainer sx={{ width: "100%" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">No</TableCell>
								<TableCell align="center">Product</TableCell>
								<TableCell align="center">Availability</TableCell>
								<TableCell align="center">Price</TableCell>
								<TableCell align="center" style={{ minWidth: 20 }}>
									Manage
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{todoList.map((todo, index) => (
								<TableRow key={todo.id} hover role="checkbox" tabIndex={-1}>
									<TableCell align="center">{index + 1}</TableCell>
									<TableCell align="center">{todo.name}</TableCell>
									<TableCell align="center">{todo.available}</TableCell>
									<TableCell align="center">{todo.price}</TableCell>
									<TableCell align="center">
										<Fab
											color="secondary"
											aria-label="edit"
											onClick={() => handleDelete(todo.id)}
										>
											<DeleteIcon fontSize="small" />
										</Fab>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

const styles = {
	container: {
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "column",
	},
	header: {
		fontSize: 30,
		fontWidth: "bold",
		margin: "30px",
	},
	heading: {
		fontSize: 25,
		fontWidth: "bold",
		marginTop: "30px",
	},
	form: {
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
	},
	inputContainer: {
		padding: "1rem",
		borderRadius: "10px",
		background: "#edf4ff",
		width: "95%",
	},
};

export default Todo;
