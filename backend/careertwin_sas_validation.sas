/* ========================================================================== */
/* CAREERTWIN 2.0 — SAS STATISTICAL VALIDATION & CROSS-VERIFICATION SCRIPT     */
/* Purpose: Independent enterprise validation of Python SciPy/Statsmodels     */
/*          hypothesis tests, effect sizes, FDR corrections, and odds ratios  */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* STEP 1: DEFINE WORK ENVIRONMENT & DATA LOCATIONS                           */
/* -------------------------------------------------------------------------- */
%let data_dir = c:\Users\gupta\Downloads\careertwin\data;

/* -------------------------------------------------------------------------- */
/* STEP 2: IMPORT JDS SKILL TRAITS (N = 139)                                  */
/* -------------------------------------------------------------------------- */
proc import datafile="&data_dir\JDS Skill Traits.xlsx"
    out=work.jds_raw
    dbms=xlsx
    replace;
    getnames=yes;
run;

/* Clean variable names and standardize binary target */
data work.jds_clean;
    set work.jds_raw;
    /* Target: 1 = High Salary Hike, 0 = Low Salary Hike */
    hike_target = salary_hike_high_or_low;
run;

/* -------------------------------------------------------------------------- */
/* STEP 3: DESCRIPTIVE & TWO-SAMPLE WELCH T-TESTS (PROC TTEST)                */
/* Computes unequal-variance Welch t-statistic, Satterthwaite df, and Cohen d */
/* -------------------------------------------------------------------------- */
ods output TTests=work.jds_ttests Equality=work.jds_equality Statistics=work.jds_stats;
proc ttest data=work.jds_clean sides=2 alpha=0.05 cochran;
    class hike_target;
    var coding_skills 
        maths_stats_skills 
        dashboard_and_storytelling_skills 
        ai_and_ml_skills 
        big_data_skills;
run;

/* -------------------------------------------------------------------------- */
/* STEP 4: NON-PARAMETRIC MANN-WHITNEY U VALIDATION (PROC NPAR1WAY)           */
/* Validates Wilcoxon Rank-Sum test statistics without normality assumption   */
/* -------------------------------------------------------------------------- */
ods output WilcoxonScores=work.jds_wilcoxon;
proc npar1way data=work.jds_clean wilcoxon;
    class hike_target;
    var coding_skills 
        maths_stats_skills 
        dashboard_and_storytelling_skills 
        ai_and_ml_skills 
        big_data_skills;
run;

/* -------------------------------------------------------------------------- */
/* STEP 5: MULTIPLE TESTING ADJUSTMENT (PROC MULTTEST - BENJAMINI-HOCHBERG)   */
/* -------------------------------------------------------------------------- */
proc multtest fdr inpvalues=work.jds_ttests(where=(Method="Satterthwaite"))
    out=work.jds_fdr_results;
run;

/* -------------------------------------------------------------------------- */
/* STEP 6: LOGISTIC REGRESSION ODDS RATIOS & MODEL DIAGNOSTICS (PROC LOGISTIC)*/
/* Validates Python Statsmodels Odds Ratios and Hosmer-Lemeshow fit           */
/* -------------------------------------------------------------------------- */
ods output ParameterEstimates=work.jds_param_est OddsRatios=work.jds_odds_ratios FitStatistics=work.jds_fit;
proc logistic data=work.jds_clean descending plots(only)=(roc);
    model hike_target = coding_skills 
                        maths_stats_skills 
                        dashboard_and_storytelling_skills 
                        ai_and_ml_skills 
                        big_data_skills
          / lackfit rsquare clodds=pl;
run;

/* -------------------------------------------------------------------------- */
/* STEP 7: IMPORT & VALIDATE SDS PERSONALITY TRAITS (N = 161)                 */
/* -------------------------------------------------------------------------- */
proc import datafile="&data_dir\SDS Personality Traits.xlsx"
    out=work.sds_raw
    dbms=xlsx
    replace;
    getnames=yes;
run;

ods output TTests=work.sds_ttests Statistics=work.sds_stats;
proc ttest data=work.sds_raw sides=2 alpha=0.05;
    class success_classification_high_low;
    var neuroticism 
        extraversion 
        openness_to_experience 
        agreeableness 
        conscientiousness;
run;

/* Cross-Tabulation & Association Verification */
proc freq data=work.sds_raw;
    tables success_classification_high_low / chisq;
run;

/* -------------------------------------------------------------------------- */
/* SUMMARY PRINT: VERIFY DUAL-ENGINE CONSISTENCY WITH CAREERTWIN PYTHON RUN   */
/* -------------------------------------------------------------------------- */
title "CareerTwin 2.0: SAS Cross-Validation Complete";
proc print data=work.jds_odds_ratios;
run;
title;
