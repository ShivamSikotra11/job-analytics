import React, { useState, useRef } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  Box,
} from '@mui/material';
import JSONdata from "./json.json"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const App = () => {
  const [selectedYearData, setSelectedYearData] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('work_year');
  const tableRef = useRef(null);

  const processSalaryData = (rawData) => {
    const yearMap = {};

    rawData.forEach(item => {
      const year = item.work_year;
      const salary = parseFloat(item.salary_in_usd);
      const title = item.job_title;

      if (!yearMap[year]) {
        yearMap[year] = {
          year: year,
          totalJobs: 0,
          totalSalary: 0,
          jobDetails: {}
        };
      }

      yearMap[year].totalJobs += 1;
      yearMap[year].totalSalary += salary;

      if (!yearMap[year].jobDetails[title]) {
        yearMap[year].jobDetails[title] = 0;
      }
      yearMap[year].jobDetails[title] += 1;
    });

    return Object.values(yearMap).map(yearData => ({
      ...yearData,
      averageSalary: yearData.totalSalary / yearData.totalJobs,
      jobDetails: Object.entries(yearData.jobDetails).map(([title, count]) => ({
        title,
        count
      }))
    }));
  };

  const data = processSalaryData(JSONdata);
  console.log(data);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (jobDetails) => {
    setSelectedYearData(jobDetails);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // console.log(data);
  // console.log(processSalaryData(data));
  return (
    <Container>
      <Typography variant="h4" gutterBottom>ML Engineer Salaries</Typography>

      <TableContainer component={Paper}>
        <Table>
          
          <TableHead>
            <TableRow>
              {['year', 'totalJobs', 'averageSalary'].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : 'asc'}
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.sort((a, b) => {
              const isAsc = order === 'asc';
              switch (orderBy) {
                case 'year': return isAsc ? a.year - b.year : b.year - a.year;
                case 'totalJobs': return isAsc ? a.totalJobs - b.totalJobs : b.totalJobs - a.totalJobs;
                case 'averageSalary': return isAsc ? a.averageSalary - b.averageSalary : b.averageSalary - a.averageSalary;
                default: return 0;
              }
            }).map((row,i) => (
              <TableRow key={i} onClick={() => handleRowClick(row.jobDetails)}>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.totalJobs}</TableCell>
                <TableCell>{row.averageSalary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box my={4}>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </Box>

      {selectedYearData && (
        <Box my={4} ref={tableRef} >
          <Typography variant="h6">Job Details for Selected Year</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Number of Jobs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedYearData.map((detail) => (
                  <TableRow key={detail.title}>
                    <TableCell>{detail.title}</TableCell>
                    <TableCell>{detail.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default App;
