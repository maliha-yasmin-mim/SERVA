import { MATCHING_WEIGHTS } from '../config/constants.js';

export const calculateCandidateMatchScore = (job, candidate) => {
  let categoryScore = 0;
  let availabilityScore = 0;
  let locationScore = 0;
  let experienceScore = 0;
  let ratingScore = 0;
  const matchFactors = [];

  // 1. Category & Skill Match (Weight: 35%)
  const jobCategory = (job.category || '').toLowerCase();
  const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());

  const userSkills = (candidate.skills || []).map(s => s.toLowerCase());
  const userServices = (candidate.servicesOffered || []).map(s => s.toLowerCase());

  let skillOverlapCount = 0;
  if (jobSkills.length > 0) {
    jobSkills.forEach(reqSkill => {
      if (userSkills.some(us => us.includes(reqSkill) || reqSkill.includes(us))) {
        skillOverlapCount++;
      }
    });
    const skillRatio = skillOverlapCount / jobSkills.length;
    categoryScore = skillRatio * 100;
  } else {
    // If no specific skills listed, check category in user's services/skills
    if (userServices.some(s => s.includes(jobCategory)) || userSkills.some(s => s.includes(jobCategory))) {
      categoryScore = 100;
    } else {
      categoryScore = 60; // base relevance
    }
  }

  if (categoryScore >= 70) {
    matchFactors.push(`Strong skill match (${skillOverlapCount} matching skills)`);
  }

  // 2. Availability Match (Weight: 25%)
  if (candidate.isAvailableNow) {
    availabilityScore = 100;
    matchFactors.push('Immediate availability (Available Now)');
  } else if (candidate.availabilitySchedule?.weekdays || candidate.availabilitySchedule?.weekends) {
    availabilityScore = 75;
    matchFactors.push('Regular weekly schedule alignment');
  } else {
    availabilityScore = 40;
  }

  // 3. Location Compatibility (Weight: 20%)
  const jobLoc = (job.location || '').toLowerCase();
  const userLoc = (candidate.location || '').toLowerCase();

  if (jobLoc && userLoc) {
    const jobCity = jobLoc.split('-')[0].trim();
    const userCity = userLoc.split('-')[0].trim();

    if (jobLoc === userLoc) {
      locationScore = 100;
      matchFactors.push(`Same area (${job.location})`);
    } else if (jobCity === userCity) {
      locationScore = 75;
      matchFactors.push(`Same city (${jobCity.toUpperCase()})`);
    } else {
      locationScore = 30;
    }
  } else {
    locationScore = 50;
  }

  // 4. Experience Relevance (Weight: 10%)
  const jobsDone = candidate.completedJobsCount || 0;
  if (jobsDone >= 10) {
    experienceScore = 100;
    matchFactors.push(`${jobsDone}+ completed jobs on SERVA`);
  } else if (jobsDone >= 3) {
    experienceScore = 75;
    matchFactors.push(`${jobsDone} verified completed jobs`);
  } else if (jobsDone >= 1) {
    experienceScore = 50;
  } else {
    experienceScore = 30;
  }

  // 5. Review Rating (Weight: 10%)
  const rating = candidate.rating || 5.0;
  ratingScore = Math.min(100, Math.max(0, (rating / 5.0) * 100));
  if (rating >= 4.5 && candidate.reviewCount > 0) {
    matchFactors.push(`High user rating (${rating.toFixed(1)} ★)`);
  }

  // Weighted total score
  const totalScore = Math.round(
    (categoryScore * MATCHING_WEIGHTS.categoryAndSkill) +
    (availabilityScore * MATCHING_WEIGHTS.availability) +
    (locationScore * MATCHING_WEIGHTS.location) +
    (experienceScore * MATCHING_WEIGHTS.experience) +
    (ratingScore * MATCHING_WEIGHTS.rating)
  );

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      categoryAndSkill: Math.round(categoryScore),
      availability: Math.round(availabilityScore),
      location: Math.round(locationScore),
      experience: Math.round(experienceScore),
      rating: Math.round(ratingScore)
    },
    matchFactors,
    explanation: `Compatibility estimate based on verified skills, availability, location proximity in ${job.location}, and past SERVA platform history.`
  };
};
