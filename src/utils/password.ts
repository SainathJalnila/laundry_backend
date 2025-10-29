import bcrypt from 'bcrypt';

const DEFAULT_ROUNDS = 12; // cost factor

export async function hashPassword(password: string, rounds: number = DEFAULT_ROUNDS): Promise<string> {
	if (typeof password !== 'string' || password.length === 0) {
		throw new Error('Password must be a non-empty string');
	}
	const salt = await bcrypt.genSalt(rounds);
	return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	if (typeof storedHash !== 'string' || storedHash.length === 0) return false;
	return await bcrypt.compare(password, storedHash);
}


