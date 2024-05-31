import api from "./api";
import * as YAML from "yamljs";
import * as fs from "fs";

async function main() {
  try {
    const holidays2023 = [
      "2023-01-01",
      "2023-01-02",
      "2023-01-03",
      "2023-01-04",
      "2023-01-05",
      "2023-01-06",
      "2023-01-07",
      "2023-01-08",
      "2023-02-23",
      "2023-03-08",
      "2023-05-01",
      "2023-05-09",
      "2023-06-12",
      "2023-11-04",
      "2023-02-24",
      "2023-05-08",
      "2023-11-06",
    ];

    const workingWeekends2023 = ["2023-01-01", "2023-01-08"];

    const holidays2024 = [
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      "2024-01-04",
      "2024-01-05",
      "2024-01-06",
      "2024-01-07",
      "2024-01-08",
      "2024-02-23",
      "2024-03-08",
      "2024-05-01",
      "2024-05-09",
      "2024-06-12",
      "2024-04-29",
      "2024-04-30",
      "2024-05-10",
      "2024-12-30",
      "2024-12-31",
      "2024-11-04",
    ];

    const workingWeekends2024 = [
      "2024-01-06",
      "2024-01-07",
      "2024-04-27",
      "2024-11-02",
      "2024-12-28",
    ];
    // Заполнить праздничные и перенесённые рабочие дни за 2023 год
    await Promise.all([
      ...holidays2023.map((date) => api.post("/holiday/add", { date })),
      ...workingWeekends2023.map((date) =>
        api.post("/working-weekend/add", { date })
      ),
    ]);
    console.log("Праздничные и перенесенные рабочие дни за 2023 год записаны!");

    // Получить количество рабочих часов в апреле 2023
    const april2023Hours = await api.get("/working-hour/get?year=2023&month=4");
    console.log("Рабочие часы в апреле 2023:", april2023Hours.data);

    // Получить количество рабочих часов в мае 2023
    const may2023Hours = await api.get("/working-hour/get?year=2023&month=5");
    console.log("Рабочие часы в мае 2023:", may2023Hours.data);

    // // Получить количество рабочих часов с апреля 2023 по март 2024 включительно
    const intervalHours = await api.get(
      "/working-hour/get?start=2023-04&end=2024-03"
    );
    console.log(
      "Рабочие часы за период с апреля 2023 по март 2024:",
      intervalHours.data
    );

    // Заполнить праздничные и перенесённые рабочие дни за 2024 год
    await Promise.all([
      ...holidays2024.map((date) => api.post("/holiday/add", { date })),
      ...workingWeekends2024.map((date) =>
        api.post("/working-weekend/add", { date })
      ),
    ]);
    console.log("Праздничные и перенесенные рабочие дни за 2024 год записаны!");

    // Отменить праздничные дни 29.04-01.05.24
    await api.delete("/holiday/delete", { data: { date: "2024-04-29" } });
    await api.delete("/holiday/delete", { data: { date: "2024-04-30" } });
    await api.delete("/holiday/delete", { data: { date: "2024-05-01" } });
    console.log("Праздничные дни 29.04-01.05.24 отменены!");

    // Добавить праздничные дни 06-08.05.24
    await api.post("/holiday/add", { date: "2024-05-06" });
    await api.post("/holiday/add", { date: "2024-05-07" });
    await api.post("/holiday/add", { date: "2024-05-08" });
    console.log("Праздничные дни 06-08.05.24 записаны!");

    // Получить количество рабочих часов в апреле 2024
    const april2024Hours = await api.get("/working-hour/get?year=2024&month=4");
    console.log("Рабочие часы в апреле 2024:", april2024Hours.data);

    // Получить количество рабочих часов в мае 2024
    const may2024Hours = await api.get("/working-hour/get?year=2024&month=5");
    console.log("Рабочие часы в мае 2024:", may2024Hours.data);

    // // Получить количество рабочих часов с апреля 2023 по март 2024 включительно
    const fullIntervalHours = await api.get(
      "/working-hour/get?start=2023-04&end=2024-03"
    );
    console.log(
      "Рабочие часы за период с апреля 2023 по март 2024:",
      fullIntervalHours.data
    );

    // Сохранить результаты в файл YAML
    const results = {
      april2023Hours: april2023Hours.data,
      may2023Hours: may2023Hours.data,
      intervalHours: intervalHours.data,
      april2024Hours: april2024Hours.data,
      may2024Hours: may2024Hours.data,
      fullIntervalHours: fullIntervalHours.data,
    };
    fs.writeFileSync("results.yaml", YAML.stringify(results, 4));

    console.log("Результаты записаны в файл results.yaml");
    process.exit(0);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

main();
