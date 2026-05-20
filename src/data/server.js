const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JSON_PATH = path.resolve(__dirname, 'pc.json');

// PATCH метод - оновлює ТІЛЬКИ content
app.patch('/api/update-content', async (req, res) => {
    const { id, content } = req.body;

    try {
        // Блокуємо файл на час операції
        const lockPath = JSON_PATH + '.lock';
        
        // Перевіряємо наявність lock файлу
        let attempts = 0;
        while (attempts < 10) {
            try {
                await fs.access(lockPath);
                // Файл заблокований, чекаємо
                await new Promise(resolve => setTimeout(resolve, 50));
                attempts++;
            } catch {
                // Файл не заблокований
                break;
            }
        }

        // Створюємо lock
        await fs.writeFile(lockPath, Date.now().toString());

        try {
            // Читаємо
            const data = await fs.readFile(JSON_PATH, 'utf8');
            const pcData = JSON.parse(data);

            // Оновлюємо
            const file = pcData.Screen?.textfile?.find(f => f.id === id);
            if (!file) {
                await fs.unlink(lockPath);
                return res.status(404).json({ error: "File not found" });
            }

            file.content = content;

            // Пишемо
            await fs.writeFile(JSON_PATH, JSON.stringify(pcData, null, 4));

            // Видаляємо lock
            await fs.unlink(lockPath);

            res.json({ success: true, message: "Content updated" });
        } catch (err) {
            // Видаляємо lock у разі помилки
            await fs.unlink(lockPath).catch(() => {});
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server on port 5000');
});