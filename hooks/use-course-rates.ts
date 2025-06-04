import { useState, useEffect, useMemo, useCallback } from "react";

interface CourseRateData {
  prefecture: string;
  club_name: string;
  notes?: string | null;
  course?: string | null;
  tee?: string | null;
  course_rate?: number | null;
}

interface CourseOption {
  value: string;
  label: string;
}

export function useCourseRates() {
  console.log("-console by copilot-\n", "useCourseRates hook initialized");
  
  const [courseRatesData, setCourseRatesData] = useState<CourseRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // コースレートデータを読み込む
  useEffect(() => {
    async function loadCourseRates() {
      try {
        console.log("-console by copilot-\n", "Loading course rates data...");
        const response = await fetch("/Corse_Rates.json");
        if (!response.ok) {
          throw new Error("Failed to load course rates data");
        }
        const data: CourseRateData[] = await response.json();
        console.log("-console by copilot-\n", "Course rates data loaded:", data.length, "entries");
        setCourseRatesData(data);
      } catch (err) {
        console.error("-console by copilot-\n", "Error loading course rates:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadCourseRates();
  }, []);
  // ユニークなクラブ名のリストを生成
  const clubOptions = useMemo(() => {
    if (courseRatesData.length === 0) return [];
    
    const uniqueClubs = Array.from(new Set(
      courseRatesData
        .map(item => item.club_name)
        .filter(club => club && club.trim() !== "")
    ));
    console.log("-console by copilot-\n", "Generated", uniqueClubs.length, "club options");
    return uniqueClubs.map(club => ({
      value: club,
      label: club
    }));
  }, [courseRatesData]);
  // 選択されたクラブに基づいてコース名のリストを生成
  const getCoursesForClub = useCallback((clubName: string): CourseOption[] => {
    console.log("-console by copilot-\n", "Getting courses for club:", clubName);
    const clubData = courseRatesData.filter(item => item.club_name === clubName);
    const uniqueCourses = Array.from(new Set(
      clubData
        .map(item => item.course)
        .filter(course => course !== null && course !== undefined && course.trim() !== "")
    ));
    console.log("-console by copilot-\n", "Found courses for", clubName, ":", uniqueCourses);
    return uniqueCourses.map(course => ({
      value: course!,
      label: course!
    }));
  }, [courseRatesData]);
  // 選択されたクラブとコースに基づいてティーのリストを生成
  const getTeesForCourse = useCallback((clubName: string, courseName?: string): CourseOption[] => {
    console.log("-console by copilot-\n", "Getting tees for club:", clubName, "course:", courseName);
    let filteredData = courseRatesData.filter(item => item.club_name === clubName);
    
    if (courseName) {
      filteredData = filteredData.filter(item => item.course === courseName);
    }
    
    const uniqueTees = Array.from(new Set(
      filteredData
        .map(item => item.tee)
        .filter(tee => tee !== null && tee !== undefined && tee.trim() !== "")
    ));
    console.log("-console by copilot-\n", "Found tees:", uniqueTees);
    return uniqueTees.map(tee => ({
      value: tee!,
      label: tee!
    }));
  }, [courseRatesData]);
  // 選択された組み合わせのコースレートを取得
  const getCourseRate = useCallback((clubName: string, courseName?: string, teeName?: string): number | null => {
    const matchingData = courseRatesData.find(item => 
      item.club_name === clubName &&
      (courseName ? item.course === courseName : true) &&
      (teeName ? item.tee === teeName : true)
    );
    console.log("-console by copilot-\n", "Course rate for", clubName, courseName, teeName, ":", matchingData?.course_rate);
    return matchingData?.course_rate || null;
  }, [courseRatesData]);

  return {
    courseRatesData,
    loading,
    error,
    clubOptions,
    getCoursesForClub,
    getTeesForCourse,
    getCourseRate,
  };
}
