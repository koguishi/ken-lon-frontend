export const addMonths = (date: Date, monthsToAdd: number): Date => {
    const newDate = new Date(date);
    const day = newDate.getDate();

    // Move para o primeiro dia do mês alvo
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);

    // Pega o último dia do mês alvo
    const lastDayOfTargetMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0
    ).getDate();

    // Define o dia como o mínimo entre o dia original e o último dia do mês
    newDate.setDate(Math.min(day, lastDayOfTargetMonth));

    return newDate;
};

export function formatDateToYYYYMMDD(date: Date, separator: string = "-"): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${separator}${month}${separator}${day}`;
}

export const formatDateToDDMMYYYY = (date: Date, separator: string = "/"): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}${separator}${month}${separator}${year}`;
}

export function primeiroDiaDoAno(): string {
  const ano = new Date().getFullYear();
  return `01/01/${ano}`;
}

export function ultimoDiaDoAno(): string {
  const ano = new Date().getFullYear();
  return `31/12/${ano}`;
}
