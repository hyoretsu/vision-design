const alunosAtivos: string[][] = [];
const rows = document.querySelectorAll("#anulosAtivos .listagem tbody tr");

for (let i = 0; i < rows.length; i++) {
	alunosAtivos[i] = [];

	for (const col of rows[i].children) {
		alunosAtivos[i].push(col.textContent!.trim());
	}
}

console.log(JSON.stringify(alunosAtivos));
