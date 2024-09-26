import { Request, Response } from 'express';
import pool from '../models/db';
import axios from 'axios';

export const createMatchRequest = async (req: Request, res: Response) => {
    const { username1, username2, winner } = req.body;

    if (!username1 || !username2 || winner === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Insert the match request into the database
        const [result] = await pool.query(
            'INSERT INTO match_requests (username1, username2, winner) VALUES (?, ?, ?)',
            [username1, username2, winner]
        );

        res.status(201).json({ message: 'Match request created.', requestId: (result as any).insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const confirmMatch = async (req: Request, res: Response) => {
    const { matchId } = req.body;
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
        // Start a new transaction
        await connection.beginTransaction();

        // Fetch the match details to use in the update-rating request
        const [rows] = await connection.query(
            'SELECT username1, username2, winner FROM match_requests WHERE id = ?',
            [matchId]
        );

        if ((rows as any).length === 0) {
            await connection.rollback(); // Roll back the transaction
            return res.status(404).json({ message: 'Match not found.' });
        }

        const match = (rows as any)[0];

        // Call the update-rating endpoint
        const response = await axios.post('http://localhost:5000/api/rating/rating-update', {
            username1: match.username1,
            username2: match.username2,
            winner: match.winner,
        }, {
            withCredentials: true,
            headers: {
                Cookie: Object.keys(req.cookies).map(key => `${key}=${req.cookies[key]}`).join('; ')
              }
        });

        // If the rating update is successful, delete the entry from match_requests table
        if (response.status === 200) {
            await connection.query('DELETE FROM match_requests WHERE id = ?', [matchId]);
            await connection.commit(); // Commit the transaction
            return res.status(200).json({ message: 'Match confirmed and rating updated successfully.' });
        } else {
            await connection.rollback(); // Roll back the transaction
            return res.status(500).json({ message: 'Rating update failed.' });
        }

    } catch (error) {
        console.error('Error confirming match:', error);
        await connection.rollback(); // Roll back the transaction in case of error
        res.status(500).json({ message: 'Server error while confirming match.' });
    } finally {
        connection.release(); // Release the connection back to the pool
    }
};