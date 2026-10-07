package com.example.job_service.service;

import com.example.job_service.dao.LabourerJobDao;
import com.example.job_service.dto.JobData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Service
public class LabourerJobService {


    private final RestClient restClient;
    private final LabourerJobDao labourerJobDao;

    public LabourerJobService(@Qualifier("LoadBalancedrestClientbuilder") RestClient.Builder restClientbuilder, LabourerJobDao labourerJobDaoconstuct) {

        this.restClient = restClientbuilder.build();
        this.labourerJobDao = labourerJobDaoconstuct;
    }

    public List<JobData> getNearbyJobs(String userId) {
        String location;
        try {
            location = restClient.get()
                    .uri("http://labourer-service/api/labourer/getlocation/{userId}", userId)
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            log.error("communication error between services==> " + e.getMessage());
            throw new RuntimeException(e);
        }
        return labourerJobDao.getNearbyJobsByLocation(location);
    }

    public String getWorkerName(String id){

        try{
            String name = restClient.get()
                    .uri("http://labourer-service/api/labourer/getNameById/{userId}",id)
                    .retrieve()
                    .body(String.class);

            return  name;
        }catch (Exception e){
            log.error("communication error, could not fetch labourer name ==> " + e.getMessage());
            throw  new RuntimeException(e);
        }
    }
}
