package com.xiaomi.mif2e.fontSubsetter;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.apache.thrift.TException;

import com.google.typography.font.sfntly.Font;
import com.xiaomi.mif2e.fontSubsetter.SubsetterService.Iface;

public class SubsetterServiceHandler implements Iface {

	@Override
	public void genSubset(String filePath, String outputDir, String subset,
			List<FileType> types) throws TException {

		System.out.println("Received file to subset: " + filePath);
		System.out.println("Chars to genSubset: " + subset);

		File fontFile = new File(filePath);
		try {
			Font newFont = Util.subset(fontFile, subset);
			for (FileType type : types) {
				if (type == FileType.TTF) {
					File outputFile = new File(outputDir, "ttf.ttf");
					Util.saveAsTtf(outputFile, newFont);
				} else if (type == FileType.EOT) {
					File outputFile = new File(outputDir, "eot.eot");
					Util.saveAsEot(outputFile, newFont, false);
				} else if (type == FileType.WOFF) {
					File outputFile = new File(outputDir, "woff.woff");
					Util.saveAsWoff(outputFile, newFont);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new IOException(ExceptionType.IO, e.getMessage());
		}

		System.out.println("Finished subseting: " + filePath);

	}

	@Override
	public Map<String, String> getFontInfo(String filePath) throws TException {

		System.out.println("Getting the info of file: " + filePath);

		try {
			System.out.println("Finished getting the info of file: " + filePath);
			return Util.getFontInfo(filePath);
		} catch (Exception e) {
			e.printStackTrace();
			throw new IOException(ExceptionType.IO, e.getMessage());
		}

	}

}
