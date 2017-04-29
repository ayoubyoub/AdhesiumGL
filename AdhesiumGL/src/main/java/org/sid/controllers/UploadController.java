package org.sid.controllers;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/api")
public class UploadController {

	@Autowired
	private Environment env;

	@RequestMapping(value = "/clients", headers = "content-type=multipart/*", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public @ResponseBody HttpEntity<List<String>> uploadClients(@RequestParam("uploadFile") MultipartFile file) {
		List<String> customerList = new ArrayList<String>();
		String fileName = file.getOriginalFilename();
		String extension = fileName.substring(fileName.lastIndexOf("."));
		double randomName = Math.random();
		String dateName = new SimpleDateFormat("dd-MM-yyyy").format(new Date());
		try {
			fileName = dateName + "." + randomName + extension;
			customerList.add(fileName);
			byte[] bytes = file.getBytes();
			String directory = env.getProperty("upload.clients.file.path");
			String uploadFilePath = Paths.get("." + File.separator + directory, fileName).toString();
			final BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(
					new FileOutputStream(new File(uploadFilePath)));
			bufferedOutputStream.write(bytes);
			bufferedOutputStream.close();
			return ResponseEntity.ok(customerList);
		} catch (IOException e) {
			return ResponseEntity.noContent().build();
		}
		
	}
}
